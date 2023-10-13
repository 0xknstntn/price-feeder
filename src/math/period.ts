import { 
        StargateClient 
} from "@cosmjs/stargate";
import { restNetwork } from "../constant/url";

export async function CalculateVotePeriod(client: StargateClient): Promise<[number, number, number, number]> {
        let blockHeight = await client.getHeight()
        let json = (await fetch(restNetwork + "/core/oracle/v1beta1/params"))
        let parse_json = await json.json()
        let oracleVotePeriodObj = parse_json
	let nextBlockHeight = blockHeight + 1
	let currentVotePeriod = Math.floor(Number(nextBlockHeight) / Number(oracleVotePeriodObj.params.vote_period))
	let indexInVotePeriod = nextBlockHeight % oracleVotePeriodObj.params.vote_period
        return [Number(oracleVotePeriodObj.params.vote_period), nextBlockHeight, currentVotePeriod, indexInVotePeriod]
}