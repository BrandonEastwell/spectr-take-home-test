import {acceptQuote, fetchRfqs, subscribeToQuoteUpdates,} from '../mock-api';
import {useEffect, useMemo, useState} from "react";
import type {Rfq} from "./types/rfq.ts";
import type {Filters} from "./types/filters.ts";
import FilterSideBar from "./components/FilterSideBar.tsx";
import type {Sort} from "./types/sort.ts";
import {AcceptQuoteModal} from "./components/AcceptQuoteModal.tsx";
import type {AcceptFeedback} from "./types/acceptFeedback.ts";
import {updateRfq} from "./helpers/updateRfq.ts";
import {filterRfqs} from "./helpers/filterRfqs.ts";
import {sortRfqs} from "./helpers/sortRfqs.ts";
import {getQuoteStatusMessage} from "./helpers/getQuoteStatusMessage.ts";
import {AcceptFeedbackMessage} from "./components/AcceptFeedbackMessage.tsx";
import {QuoteToolbar} from "./components/QuoteToolbar.tsx";
import {RFQCardGrid} from "./components/RFQCardGrid.tsx";
import {RFQTable} from "./components/RFQTable.tsx";

function App() {
    const [loading, setLoading] = useState(true);
    const [rfqs, setRfqs] = useState<Rfq[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({actionableOnly: false});
    const [sortOrder, setSortOrder] = useState<Sort | undefined>(undefined);
    const [selectedRfq, setSelectedRfq] = useState<Rfq | undefined>(undefined);
    const [acceptingRfqId, setAcceptingRfqId] = useState<string | undefined>(undefined);
    const [acceptFeedback, setAcceptFeedback] = useState<AcceptFeedback | undefined>(undefined);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let isMounted = true;

        const initRFQS = async () => {
            try {
                const rfqs: Rfq[] = await fetchRfqs();
                if (!isMounted) return;

                setRfqs(rfqs);
                setLoading(false);

                unsubscribe = subscribeToQuoteUpdates((update) => {
                    setRfqs((currentRfqs) => currentRfqs.map((rfq) => {
                        return updateRfq(rfq, update)
                    }));
                });

            } catch {
                if (!isMounted) return;
                setLoading(false);
                setAcceptFeedback({ type: "error", message: "Failed to load RFQs. Please try again." });
            }
        }

        initRFQS();
        return () => {
            isMounted = false;
            unsubscribe?.();
        };
    }, []);

    const handleRequestAccept = (rfq: Rfq) => {
        setAcceptFeedback(undefined);
        setSelectedRfq(rfq);
    }

    const handleConfirmAccept = async () => {
        if (!selectedRfq) return;

        const rfqToAccept = selectedRfq;
        setAcceptingRfqId(rfqToAccept.id);

        try {
            const response = await acceptQuote(rfqToAccept.id);

            if (response.success) {
                setAcceptFeedback({ type: "success", message: `${rfqToAccept.currencyPair} quote accepted.` });
            } else {
                setAcceptFeedback({ type: "error", message: response.message });
            }
        } catch {
            setAcceptFeedback({ type: "error", message: "Accept failed. Please try again." });
        } finally {
            setAcceptingRfqId(undefined);
            setSelectedRfq(undefined);
        }
    }

    const filteredRfqs = filterRfqs(rfqs, filters);
    const sortedRfqs = sortRfqs(filteredRfqs, sortOrder);

    const quoteStatusMessage = useMemo(() => {
        return getQuoteStatusMessage(loading, sortedRfqs.length, rfqs.length);
    }, [loading, rfqs.length, sortedRfqs.length]);

    return (
        <main className="relative min-h-screen max-w-screen md:place-items-center bg-linear-to-r from-background to-surface text-text-primary font-display">
            <FilterSideBar showFilters={showFilters} setShowFilters={setShowFilters} filters={filters} setFilters={setFilters} />
            {selectedRfq && (
                <AcceptQuoteModal
                    rfq={selectedRfq}
                    accepting={acceptingRfqId === selectedRfq.id}
                    onCancel={() => setSelectedRfq(undefined)}
                    onConfirm={handleConfirmAccept}
                />
            )}
            <section className="mx-auto p-2" aria-labelledby="page-heading">
                <h1 id="page-heading" className="text-3xl font-extrabold mb-4">Live Quote Blotter</h1>
                <p id="quote-status" role="status" aria-live="polite" className="sr-only">
                    {quoteStatusMessage}
                </p>
                {acceptFeedback && <AcceptFeedbackMessage feedback={acceptFeedback} />}
                <QuoteToolbar
                    showFilters={showFilters}
                    sortOrder={sortOrder}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onSortChange={setSortOrder}
                />
                <div className="rfq-container" aria-describedby="quote-status">
                    <div className="md:hidden">
                        <RFQCardGrid
                            loading={loading}
                            rfqs={sortedRfqs}
                            acceptingRfqId={acceptingRfqId}
                            onAccept={handleRequestAccept}
                        />
                    </div>
                    <RFQTable
                        loading={loading}
                        rfqs={sortedRfqs}
                        acceptingRfqId={acceptingRfqId}
                        onAccept={handleRequestAccept}
                    />
                </div>
            </section>
        </main>

    )
}

export default App
