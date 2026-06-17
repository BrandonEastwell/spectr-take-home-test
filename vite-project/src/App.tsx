import {
    fetchRfqs, type Rfq,
    subscribeToQuoteUpdates,
} from '../mock-api';
import {type ReactElement, useEffect, useState} from "react";

function getLastUpdatedInSeconds(ISOString: string | undefined) {
    if (!ISOString) return "-";
    const date = new Date(ISOString);
    const timeNow = new Date();
    const diff = timeNow.getTime() - date.getTime();
    return Math.floor(diff / 1000);
}

function App() {
    const [loading, setLoading] = useState(true);
    const [rfqs, setRfqs] = useState<Rfq[]>([]);

    useEffect(() => {
        const initRFQS = async () => {
            const rfqs: Rfq[] = await fetchRfqs();
            setRfqs(rfqs);
            setLoading(false);

            // const unsubscribe = subscribeToQuoteUpdates((update) => {
            //     console.log('live update', update);
            // });
        }

        initRFQS();
    }, [])


    return (
        loading ? <div>Loading...</div> :
        <section className="grid grid-cols-3 p-2 gap-4">
            { rfqs.map((rfq) => (
                <div key={rfq.id} className={"rfq-card flex flex-col gap-2 border p-2 w-full aspect-square" + (Number(getLastUpdatedInSeconds(rfq.lastUpdated)) > 30 ? ' bg-yellow-50' : '')}>
                    <div>
                        <div className="flex flex-row justify-between">
                            <span>{rfq.currencyPair}</span>
                            <span>{rfq.status}</span>
                        </div>
                        <RFQCardRow>
                            <span>{rfq.direction}</span>
                            <span>{rfq.notional}</span>
                        </RFQCardRow>
                    </div>
                    <div className="flex flex-col">
                        <RFQCardRow>
                            <span>Bid</span>
                            <span>{rfq.bid ? rfq.bid : "-"}</span>
                        </RFQCardRow>
                        <RFQCardRow>
                            <span>Offer</span>
                            <span>{rfq.offer ? rfq.offer : "-"}</span>
                        </RFQCardRow>
                    </div>
                    <div className="flex flex-col">
                        <RFQCardRow>
                            <span>Expiry</span>
                            <span>{rfq.expiry}</span>
                        </RFQCardRow>
                        <RFQCardRow>
                            <span>Updated</span>
                            <span>{rfq.lastUpdated ? getLastUpdatedInSeconds(rfq.lastUpdated) + "s ago" : "-"}</span>
                        </RFQCardRow>
                        <RFQCardRow>
                            <span>Sequence</span>
                            <span>{rfq.sequenceNumber}</span>
                        </RFQCardRow>
                    </div>
                </div>
            ))}
        </section>
    )
}

function RFQCardRow({ children } : {children: ReactElement[]}) {
    return (
        <div className="grid grid-cols-2">
            {children}
        </div>
    )
}

export default App
