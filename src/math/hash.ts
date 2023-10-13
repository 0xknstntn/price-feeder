import { SHA256 } from 'jscrypto/SHA256'
import { restNetwork } from "../constant/url";

export function GetAggregateVoteHash(exchange_rates: string, salt: string, validator: string): string {
        return aggregateVoteHash(exchange_rates, salt, validator)
}
function aggregateVoteHash(exchangeRates: string, salt: string, validator: string): string {
        const payload = `${salt}:${exchangeRates.toString()}:${validator}`
        return SHA256.hash(payload).toString().substring(0, 40)
}

export async function GetAggregateVoteHashFromApi(exchange_rates: string, salt: string, validator: string): Promise<string> {
        let json = (await fetch(restNetwork + `/core/oracle/v1beta1/hash/${salt}/${exchange_rates}/${validator}`))
        let obj = await json.json()
        return String(obj.hash)
}