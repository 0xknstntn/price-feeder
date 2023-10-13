import { Error } from "./error"
import { InfoLog } from "./info"
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { makeQubePath } from "../constant/path";
import { DeliverTxResponse, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { rpcNetwork, msgTypes } from "../constant/url";
import { CalculateVotePeriod, GetAggregateVoteHash, GetAggregateVoteHashFromApi } from '../math'
import { delay, PreviousPrevote } from "../constant/helpers";
import { MakeMsgAggregateExchangeRatePrevote, MakeMsgAggregateExchangeRateVote } from "../tx"; 
import { fee } from "../constant/msg";
import * as crypto from "crypto";
import { GetPriceByDenom, GetDenom } from "../provider";

async function InitWallet(mnemonic: string): Promise< DirectSecp256k1HdWallet> {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                hdPaths: [makeQubePath()],
                bip39Password: "",
                prefix: "qube",
        });
        return wallet
}

async function InitClient(rpc:string, wallet:DirectSecp256k1HdWallet): Promise<[SigningStargateClient, StargateClient]> {
        let signClient = await SigningStargateClient.connectWithSigner(
                rpc,
                wallet,
                {
                        registry: new Registry(msgTypes) 
                }
        );
        let client = await StargateClient.connect(rpc)
        return [signClient, client]
}

export async function CmdStart(mnemonic: string, val: string) {
        let previousVotePeriod = 0;
        let previousPrevote = <PreviousPrevote>{};
        let lastBlock: number = 0;


        try {
                let wallet = await InitWallet(mnemonic)
                const address = (await wallet.getAccounts())[0].address;
                InfoLog(`using wallet=${address}`)
                InfoLog(`using client=${rpcNetwork}`)
                let [signClient, client] = await InitClient(rpcNetwork, wallet)

                while(1){
                        let [oracleVotePeriod, nextBlockHeight, currentVotePeriod, indexInVotePeriod] = await CalculateVotePeriod(client)
                        if (lastBlock != nextBlockHeight-1) {
                                InfoLog("got new chain height " + "height=".blue + (nextBlockHeight-1).toString())
                                lastBlock = nextBlockHeight-1
                        }
                        if ((previousVotePeriod != 0 && currentVotePeriod == previousVotePeriod) || (indexInVotePeriod > 0 && oracleVotePeriod-indexInVotePeriod > 4)) {
                                InfoLog("skipping until next voting period")
                                await delay(1000)
                                continue
                        }
                        if ((previousVotePeriod != 0) && (currentVotePeriod-previousVotePeriod != 1)) {
                                InfoLog("missing vote during voting period")
                                previousVotePeriod = 0
                                continue
                        }

                        if (Object.keys(previousPrevote).length === 0) {

                                let salt = crypto.randomBytes(32).toString('hex');

                                let denom = await GetDenom()

                                let exchange_rates = await GetPriceByDenom(denom)
                                
                                let hash = GetAggregateVoteHash(exchange_rates, salt, val)

                                let msg = MakeMsgAggregateExchangeRatePrevote(hash, address, val)
                                let result = await signClient.signAndBroadcast(
                                        address,
                                        [msg],
                                        fee
                                );

                                InfoLog(`broadcasting pre-vote feeder=${address} hash=${hash} validator=${val}`)
                                if (result.code !== undefined && result.code !== 0) {
                                        Error("", String("failed to send tx: " + result.rawLog))
                                        continue
                                } else {
                                        InfoLog(`succeed broadcasting pre-vote txhash=${result.transactionHash}`);
                                }

                                previousPrevote = <PreviousPrevote>{
                                        ExchangeRates: exchange_rates,
                                        Salt: salt,
                                        SubmitBlockHeight: nextBlockHeight-1
                                };
                                previousVotePeriod = Math.floor(Number(nextBlockHeight - 1) / Number(oracleVotePeriod))
                        } else {
                                let msg = MakeMsgAggregateExchangeRateVote(previousPrevote.Salt, previousPrevote.ExchangeRates, address, val)

                                const result = await signClient.signAndBroadcast(
                                        address,
                                        [msg],
                                        fee
                                );
                                InfoLog(`broadcasting vote feeder=${address} rates=${previousPrevote.ExchangeRates} validator=${val}`)
                                if (result.code !== undefined && result.code !== 0) {
                                        Error("", String("failed to send tx: " + result.rawLog))
                                        continue
                                } else {
                                        InfoLog(`succeed broadcasting pre-vote txhash=${result.transactionHash}`);
                                }
                                previousPrevote = <PreviousPrevote>{};
                                previousVotePeriod = 0

                        }
                }
        } catch (error) {
                Error("get error", String(error))
        }
}