# Mock API — Live Quote Blotter

Event-driven mock API for the graduate technical task. No server required.

## Quick start

```ts
import {
  fetchRfqs,
  subscribeToQuoteUpdates,
  acceptQuote,
} from './mock-api';

const rfqs = await fetchRfqs();

const unsubscribe = subscribeToQuoteUpdates((update) => {
  console.log('live update', update);
});

// later, on component unmount:
unsubscribe();
```

## API

### `fetchRfqs(): Promise<Rfq[]>`

Returns the initial RFQ list after a short async delay (~600ms).

May throw `Error` if the simulated network fails (rare in default config).

### `subscribeToQuoteUpdates(callback): () => void`

Registers for **push-style** quote updates (similar to a WebSocket / event bus).

- Starts emitting when the first subscriber connects
- Stops the background timer when the last subscriber unsubscribes
- Default interval: **2 seconds** between update batches
- Each `QuoteUpdate` includes a `sequenceNumber` per RFQ

Always call the returned unsubscribe function (e.g. in `useEffect` cleanup).

### `acceptQuote(rfqId): Promise<AcceptQuoteResponse>`

Simulates accepting a quote (~400–800ms delay).

- On success: RFQ status becomes `Accepted` and subscribers receive an update
- On failure: returns `{ success: false, message }` (does not throw)

## Optional RxJS adapter

```ts
import { fromQuoteUpdates } from './observable-adapter';

useEffect(() => {
  const sub = fromQuoteUpdates().subscribe(applyUpdate);
  return () => sub.unsubscribe();
}, []);
```

## Test helpers

Use these in Jest/RTL tests to control timing and drive the update stream deterministically.

```ts
import {
  __resetMockApi,
  __configureMockApi,
  __emitQuoteUpdate,
  __getRfqsSnapshot,
} from './mock-api';

beforeEach(() => {
  __resetMockApi({ updateIntervalMs: 0 });
});

it('applies a quote update', () => {
  __emitQuoteUpdate({
    rfqId: 'rfq-001',
    bid: 0.118,
    offer: 0.122,
    status: 'Quoted',
    sequenceNumber: 1,
    lastUpdated: new Date().toISOString(),
  });

  const snapshot = __getRfqsSnapshot();
  // assert on snapshot...
});
```

### `__resetMockApi(overrides?)`

Resets in-memory state and subscribers. Pass config overrides to set behaviour for the next test.

### `__configureMockApi(options)`

| Option | Default | Purpose |
|---|---|---|
| `fetchDelayMs` | 600 | Loading state duration |
| `fetchFailureRate` | 0 | Probability fetch throws (`1` = always) |
| `fetchReturnsEmpty` | `false` | Return `[]` from `fetchRfqs` |
| `updateIntervalMs` | 2000 | Live update cadence (`0` = off) |
| `acceptFailureRate` | 0.1 | Random accept failures |
| `acceptAlwaysFailIds` | `['rfq-007']` | Deterministic accept failure by id |

### `__emitQuoteUpdate(update)`

Manually push a single update through the store and to all subscribers.

### `__getRfqsSnapshot()`

Returns the current in-memory RFQ list without fetch delay — useful for assertions.
