export const typeUrlMsgAggregateExchangeRateVote = "/core.oracle.v1beta1.MsgAggregateExchangeRateVote";

interface MsgVote {
        typeUrl: string
        value: MsgAggregateExchangeRateVote
}

interface MsgAggregateExchangeRateVote{
        salt:          string,
        exchangeRates: string,
        feeder:        string,
        validator:     string
}

export function MakeMsgAggregateExchangeRateVote(salt: string, rates: string, feeder: string, val: string): MsgVote {
        return {
                typeUrl: typeUrlMsgAggregateExchangeRateVote,
                value: {
                        salt: salt,
                        exchangeRates: rates,
                        feeder: feeder,
                        validator: val,
                },
        }
}