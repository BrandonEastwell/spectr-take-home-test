export type RfqStatus = 'Open' | 'Quoted' | 'Accepted' | 'Rejected' | 'Expired';

export type Direction = 'Buy' | 'Sell';

export interface Rfq {
	id: string;
	currencyPair: string;
	direction: Direction;
	notional: number;
	/** Calendar date in YYYY-MM-DD (UTC). */
	expiry: string;
	status: RfqStatus;
	bid?: number;
	offer?: number;
	/** ISO-8601 timestamp of last quote update. */
	lastUpdated?: string;
	/** Monotonic per-RFQ version; higher = newer. */
	sequenceNumber: number;
}

export interface QuoteUpdate {
	rfqId: string;
	bid?: number;
	offer?: number;
	status?: RfqStatus;
	lastUpdated: string;
	sequenceNumber: number;
}

export type Unsubscribe = () => void;

export type QuoteUpdateCallback = (update: QuoteUpdate) => void;

export interface AcceptQuoteResult {
	success: true;
	rfqId: string;
	status: 'Accepted';
}

export interface AcceptQuoteError {
	success: false;
	rfqId: string;
	message: string;
}

export type AcceptQuoteResponse = AcceptQuoteResult | AcceptQuoteError;
