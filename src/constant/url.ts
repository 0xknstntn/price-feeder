import dotenv from 'dotenv';
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgAggregateExchangeRatePrevote, MsgAggregateExchangeRateVote } from "../proto/oracle/v1beta1/tx";
import { typeUrlMsgAggregateExchangeRatePrevote, typeUrlMsgAggregateExchangeRateVote } from "../tx"

dotenv.config();

export const chainId = "qube-2"
export const chainName = "Qube Testnet"
export const url = process.env.URL!
export const corsProxy = "https://smoggy-onesies-elk.cyclic.app/"
export const rpcPort = process.env.RPCPORT!
export const restPort = process.env.RESTPORT!

export const rpcNetwork = url + rpcPort;
export const restNetwork = url + restPort;

export const msgTypes: Array<[string, GeneratedType]>  = [
        [typeUrlMsgAggregateExchangeRatePrevote, MsgAggregateExchangeRatePrevote],
        [typeUrlMsgAggregateExchangeRateVote, MsgAggregateExchangeRateVote],
];