export function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
}

export interface PreviousPrevote {
        ExchangeRates: string
	Salt: string
	SubmitBlockHeight: number
}