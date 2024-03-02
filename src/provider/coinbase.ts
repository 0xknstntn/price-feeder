import { restNetwork } from "../constant/url";

export async function GetPriceByDenom(denom: string): Promise<string> {
        var price = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${denom}`)
        var pricejson = await price.json()
        return Number(pricejson.data.rates['USDT']).toFixed(6) + denom
} 


export async function GetPriceByDenoms(denoms: string[]): Promise<string> {
        let rate = ""

        for (let index = 0; index < denoms.length; index++) {
                rate += await GetPriceByDenom(denoms[index])
                if (index != denoms.length-1) {
                        rate += ","
                }
        }
        
        return rate
} 

export async function GetDenom(): Promise<string[]> {
        let json = (await fetch(restNetwork + "/core/oracle/v1beta1/params"))
        let parse_json = await json.json()
        
        let temp_denom: string[] = []

        parse_json.params.whitelist.map((denom: any) => {
                temp_denom.push(denom.name)
        })
        return temp_denom
        
}