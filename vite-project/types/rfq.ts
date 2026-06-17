export type RfqStatus = 'Open' | 'Quoted' | 'Accepted' | 'Rejected' | 'Expired';
export type Direction = 'Buy' | 'Sell';

export interface Rfq {
    id: string;
    currencyPair: string;
    direction: Direction;
    notional: number;
    expiry: string; // YYYY-MM-DD
    status: RfqStatus;
    bid?: number;
    offer?: number;
    lastUpdated?: string; // ISO-8601
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