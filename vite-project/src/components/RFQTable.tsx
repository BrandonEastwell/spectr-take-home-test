import type {Rfq} from "../types/rfq.ts";
import {getLastUpdatedText} from "../helpers/getLastUpdatedInSeconds.ts";
import {isStale} from "../helpers/isStale.ts";
import {isTradeable} from "../helpers/isTradeable.ts";
import {LoadingSpinner} from "./LoadingSpinner.tsx";

interface RFQTableProps {
    loading: boolean;
    rfqs: Rfq[];
    acceptingRfqId: string | undefined;
    onAccept: (rfq: Rfq) => void;
}

export function RFQTable({ loading, rfqs, acceptingRfqId, onAccept }: RFQTableProps) {
    return (
        <table className="rfq-table max-w-max table-fixed bg-surface text-sm lg:text-lg rounded-lg hidden md:table">
            <caption className="sr-only">Live quote requests</caption>
            <thead>
            <tr className="border-border">
                <th scope="col" className="text-left p-2">Currency Pair</th>
                <th scope="col" className="text-left p-2">Direction</th>
                <th scope="col" className="text-left p-2">Notional</th>
                <th scope="col" className="text-left p-2">Bid</th>
                <th scope="col" className="text-left p-2">Offer</th>
                <th scope="col" className="text-left p-2">Expiry</th>
                <th scope="col" className="text-left p-2">Status</th>
                <th scope="col" className="text-left p-2">Last Updated</th>
                <th scope="col" className="text-left p-2 min-w-37.5"></th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                    <td colSpan={9} className="p-8">
                        <div className="flex min-h-80 place-self-center place-items-center justify-center"><LoadingSpinner /></div>
                    </td>
                </tr>
            ) : rfqs.length === 0 ? (
                <tr>
                    <td colSpan={9} className="p-8 text-center">No quotes match the current filters.</td>
                </tr>
            ) : (
                rfqs.map((rfq) => (
                    <tr key={rfq.id} className={"border border-border hover:bg-surface-hover " + (isStale(rfq.lastUpdated) ? "bg-warning/10" : "" )}>
                        <th scope="row" className="p-2 text-left font-normal">{rfq.currencyPair}</th>
                        <td className="p-2">{rfq.direction}</td>
                        <td className="p-2">{rfq.notional.toLocaleString()}</td>
                        <td className="p-2">{rfq.bid ?? "-"}</td>
                        <td className="p-2">{rfq.offer ?? "-"}</td>
                        <td className="p-2">{rfq.expiry}</td>
                        <td className="p-2">{rfq.status}</td>
                        <td className="p-2">
                            <span className={isStale(rfq.lastUpdated) ? "text-warning" : ""}>
                                {getLastUpdatedText(rfq.lastUpdated)}
                            </span>
                        </td>
                        <td className="p-2">
                            <button disabled={!isTradeable(rfq) || acceptingRfqId === rfq.id}
                                    type="button"
                                    onClick={() => onAccept(rfq)}
                                    aria-label={`Accept quote for ${rfq.currencyPair}`}
                                    className="rounded-md bg-primary px-4 py-2 text-white text-sm hover:opacity-90 not-disabled:cursor-pointer disabled:opacity-50">
                                {acceptingRfqId === rfq.id ? "Accepting..." : "Accept Quote"}
                            </button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
}
