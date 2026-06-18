import {fetchRfqs, subscribeToQuoteUpdates,} from '../mock-api';
import {useEffect, useState} from "react";
import {RFQCardRow} from "./components/RFQCardRow.tsx";
import type {Rfq} from "./types/rfq.ts";
import {isTradeable} from "./helpers/isTradeable.ts";
import type {Filters} from "./types/filters.ts";
import FilterSideBar from "./components/FilterSideBar.tsx";
import type {Sort} from "./types/sort.ts";
import {SORT_OPTIONS} from "./constants/sortOptions.ts";

function getLastUpdatedInSeconds(ISOString: string): number {
    const date = new Date(ISOString);
    const timeNow = new Date();
    const diff = timeNow.getTime() - date.getTime();
    return Math.floor(diff / 1000);
}

function App() {
    const [loading, setLoading] = useState(true);
    const [rfqs, setRfqs] = useState<Rfq[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({actionableOnly: false});
    const [sortOrder, setSortOrder] = useState<Sort | undefined>(undefined);

    useEffect(() => {
        const initRFQS = async () => {
            const rfqs: Rfq[] = await fetchRfqs();
            setRfqs(rfqs);
            setLoading(false);

            return subscribeToQuoteUpdates((update) => {
                const updatedRfqs = rfqs.map((rfq) => {
                    if (rfq.id === update.rfqId) {
                        return {
                            ...rfq,
                            bid: update.bid ?? rfq.bid,
                            offer: update.offer ?? rfq.offer,
                            status: update.status ?? rfq.status,
                            lastUpdated: update.lastUpdated,
                            sequenceNumber: update.sequenceNumber,
                        }
                    }
                    return rfq;
                });

                setRfqs(updatedRfqs);
            });
        }

        initRFQS();
    }, [])

    const filteredRfqs = rfqs.filter((rfq) => {
        if (filters.actionableOnly && !isTradeable(rfq)) return false;
        if (filters.currencyQuote && filters.currencyBase && (filters.currencyBase + "/" + filters.currencyQuote) !== rfq.currencyPair) return false;
        if (filters.status && rfq.status !== filters.status) return false;
        return true;
    })

    const sortedRfqs = filteredRfqs.sort((rfq1, rfq2) => {
        if (sortOrder === "Currency Pair") return rfq1.currencyPair.localeCompare(rfq2.currencyPair);
        if (sortOrder === "Last Updated") {
            if (rfq1.lastUpdated === undefined || rfq2.lastUpdated === undefined) return 0;
            return getLastUpdatedInSeconds(rfq1.lastUpdated) - getLastUpdatedInSeconds(rfq2.lastUpdated);
        }
        return 0
    })

    console.log(sortedRfqs);

    return (
        <main className="relative min-h-screen bg-linear-to-r from-background to-surface text-text-primary">
            <FilterSideBar showFilters={showFilters} setShowFilters={setShowFilters} setFilters={setFilters} />
            <section className="mx-auto p-2">
                <h1 className="text-2xl font-bold mb-4">Live Quote Blotter</h1>
                <div className="flex flex-row gap-2">
                    <button onClick={() => setShowFilters(!showFilters)}
                            className="flex flex-row place-items-center gap-1 bg-primary text-white px-3 py-1 rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="feather feather-filter">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        {showFilters ? "Filters" : "Filters"}
                    </button>
                    <div className="flex flex-row gap-2 place-items-center">
                        <label htmlFor="sortBy" className="text-sm font-medium">Sort By:</label>
                        <select id="sortBy" className="p-2 bg-background border rounded-md cursor-pointer" onChange={(e) => setSortOrder(e.target.value as Sort)}>
                            <option value="" selected>No Order</option>
                            { SORT_OPTIONS.map(sortOption => (
                                <option key={sortOption} value={sortOption}>{sortOption}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {loading ? <div>Loading...</div> :
                    <div className="flex flex-row flex-wrap gap-4 my-4">
                        {sortedRfqs.map((rfq) => (
                            <div key={rfq.id}
                                 className={"rfq-card bg-surface flex flex-col gap-2 p-2 min-w-50 aspect-square border rounded-lg " + (rfq.lastUpdated ? getLastUpdatedInSeconds(rfq.lastUpdated) > 30 ? "border-warning" : "border-border" : "border-border")}>
                                <div className="flex flex-row justify-between mb-3">
                                    <span>{rfq.currencyPair}</span>
                                    <span>{rfq.status}</span>
                                </div>
                                <RFQCardRow>
                                    <span>{rfq.direction}</span>
                                    <span>{rfq.notional}</span>
                                </RFQCardRow>
                                <div>
                                    <RFQCardRow>
                                        <span>Bid</span>
                                        <span>{rfq.bid ? rfq.bid : "-"}</span>
                                    </RFQCardRow>
                                    <RFQCardRow>
                                        <span>Offer</span>
                                        <span>{rfq.offer ? rfq.offer : "-"}</span>
                                    </RFQCardRow>
                                </div>
                                <div>
                                    <RFQCardRow>
                                        <span>Expiry</span>
                                        <span>{rfq.expiry}</span>
                                    </RFQCardRow>
                                    <RFQCardRow>
                                        <span>Updated</span>
                                        <span>{rfq.lastUpdated !== undefined ? getLastUpdatedInSeconds(rfq.lastUpdated) + "s ago" : "-"}</span>
                                    </RFQCardRow>
                                    <RFQCardRow>
                                        <span>Seq</span>
                                        <span>{rfq.sequenceNumber}</span>
                                    </RFQCardRow>
                                </div>
                                <button disabled={!isTradeable(rfq)}
                                        className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 not-disabled:cursor-pointer disabled:opacity-50">
                                    Accept Quote
                                </button>
                        </div>
                    ))}
                </div> }
            </section>
        </main>

    )
}

export default App
