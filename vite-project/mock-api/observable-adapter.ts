/**
 * Optional RxJS adapter — mirrors how our production code consumes streams.
 * Candidates are NOT required to use this.
 *
 * Usage:
 *   import { fromQuoteUpdates } from './observable-adapter';
 *   fromQuoteUpdates().subscribe(update => ...);
 */
import { Observable } from 'rxjs';
import { subscribeToQuoteUpdates } from './mock-api';
import type { QuoteUpdate } from './types';

export const fromQuoteUpdates = (): Observable<QuoteUpdate> =>
	new Observable((subscriber) => {
		const unsubscribe = subscribeToQuoteUpdates((update) => {
			subscriber.next(update);
		});
		return unsubscribe;
	});
