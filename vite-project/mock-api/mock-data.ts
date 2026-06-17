import type { Rfq } from './types';

const daysFromNow = (days: number): string => {
	const d = new Date();
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
};

const minutesAgo = (minutes: number): string => new Date(Date.now() - minutes * 60_000).toISOString();

/** Initial RFQ snapshot returned by fetchRfqs(). */
export const INITIAL_RFQS: Rfq[] = [
	{
		id: 'rfq-001',
		currencyPair: 'EUR/USD',
		direction: 'Buy',
		notional: 1_000_000,
		expiry: daysFromNow(30),
		status: 'Open',
		sequenceNumber: 0,
	},
	{
		id: 'rfq-002',
		currencyPair: 'GBP/USD',
		direction: 'Sell',
		notional: 2_500_000,
		expiry: daysFromNow(14),
		status: 'Quoted',
		bid: 0.124,
		offer: 0.128,
		lastUpdated: minutesAgo(0.2),
		sequenceNumber: 3,
	},
	{
		id: 'rfq-003',
		currencyPair: 'USD/JPY',
		direction: 'Buy',
		notional: 5_000_000,
		expiry: daysFromNow(7),
		status: 'Quoted',
		bid: 0.095,
		offer: undefined,
		lastUpdated: minutesAgo(0.5),
		sequenceNumber: 2,
	},
	{
		id: 'rfq-004',
		currencyPair: 'EUR/GBP',
		direction: 'Sell',
		notional: 750_000,
		expiry: daysFromNow(-1),
		status: 'Expired',
		bid: 0.11,
		offer: 0.115,
		lastUpdated: minutesAgo(120),
		sequenceNumber: 5,
	},
	{
		id: 'rfq-005',
		currencyPair: 'AUD/USD',
		direction: 'Buy',
		notional: 3_000_000,
		expiry: daysFromNow(21),
		status: 'Quoted',
		bid: 0.102,
		offer: 0.106,
		lastUpdated: minutesAgo(2),
		sequenceNumber: 4,
	},
	{
		id: 'rfq-006',
		currencyPair: 'EUR/USD',
		direction: 'Sell',
		notional: 1_500_000,
		expiry: daysFromNow(45),
		status: 'Rejected',
		bid: 0.118,
		offer: 0.122,
		lastUpdated: minutesAgo(10),
		sequenceNumber: 1,
	},
	{
		id: 'rfq-007',
		currencyPair: 'USD/CAD',
		direction: 'Buy',
		notional: 4_000_000,
		expiry: daysFromNow(10),
		status: 'Open',
		sequenceNumber: 0,
	},
];
