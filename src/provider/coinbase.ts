import { restNetwork } from "../constant/url";

export async function GetPriceByDenom(denom:string): Promise<string> {
        var price = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${denom}`)
        var pricejson = await price.json()
        return (pricejson.data.rates['PYUSD']).slice(0,15) + denom
} 

export async function GetDenom(): Promise<string> {
        let json = (await fetch(restNetwork + "/core/oracle/v1beta1/params"))
        let parse_json = await json.json()
        return parse_json.params.whitelist[0].name
        
}