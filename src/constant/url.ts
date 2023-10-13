import { Registry, GeneratedType} from "@cosmjs/proto-signing";
import { MsgAggregateExchangeRatePrevote, MsgAggregateExchangeRateVote } from "../proto/oracle/v1beta1/tx";
import { typeUrlMsgAggregateExchangeRatePrevote, typeUrlMsgAggregateExchangeRateVote } from "../tx"

export const chainId = "qube-2"
export const chainName = "Qube Testnet"
export const url = "http://localhost:"
export const corsProxy = "https://smoggy-onesies-elk.cyclic.app/"
export const rpcPort = "26657"
export const restPort = "1317"

export const rpcNetwork = url + rpcPort;
export const restNetwork = url + restPort;

export const msgTypes: Array<[string, GeneratedType]>  = [
        [typeUrlMsgAggregateExchangeRatePrevote, MsgAggregateExchangeRatePrevote],
        [typeUrlMsgAggregateExchangeRateVote, MsgAggregateExchangeRateVote],
];