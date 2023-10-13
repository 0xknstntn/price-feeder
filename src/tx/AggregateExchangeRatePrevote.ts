export const typeUrlMsgAggregateExchangeRatePrevote = "/core.oracle.v1beta1.MsgAggregateExchangeRatePrevote";

interface MsgPrevote {
        typeUrl: string
        value: MsgAggregateExchangeRatePrevote
}

interface MsgAggregateExchangeRatePrevote{
        hash:      string
	feeder:    string
	validator: string
}

export function MakeMsgAggregateExchangeRatePrevote(hash: string, feeder: string, val: string): MsgPrevote {
        return {
                typeUrl: typeUrlMsgAggregateExchangeRatePrevote,
                value: {
                        hash: hash,
                        feeder: feeder,
                        validator: val,
                },
        }
}