import type {RfqStatus} from "../../mock-api";
import {type Dispatch, type SetStateAction} from "react";
import {CURRENCIES} from "../constants/currencies.ts";
import type {Filters} from "../types/filters.ts";

interface FilterProps {
    showFilters: boolean;
    setShowFilters: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function FilterSideBar(filterProps: FilterProps) {
    const { showFilters, setShowFilters, setFilters } = filterProps;

    const handleClearFilters = () => {
        setFilters({ currencyBase: undefined, currencyQuote: undefined, status: undefined, actionableOnly: false });
    }

    const handleApplyFilters = () => {
        setShowFilters(false);
    }

    return (
        <div className={"absolute w-full h-full bg-transparent " + (showFilters ? "block" : "hidden")}>
            <div className={"flex flex-col justify-between bg-linear-to-r from-background to-surface min-h-screen w-80 absolute z-10 p-3"}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select id="status" className="w-full p-2 bg-background border rounded-md cursor-pointer" onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as RfqStatus }))}>
                        <option value="" selected>All</option>
                        <option value="Open">Open</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Expired">Expired</option>
                    </select>
                    <label htmlFor="currencyBase" className="text-sm font-medium">Base Currency</label>
                    <select id="currencyBase" className="w-full p-2 bg-background border rounded-md cursor-pointer" onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as RfqStatus }))}>
                        <option value="" selected>Any</option>
                        { CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                    <label htmlFor="currencyQuote" className="text-sm font-medium">Quote Currency</label>
                    <select id="currencyQuote" className="w-full p-2 bg-background border rounded-md cursor-pointer" onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as RfqStatus }))}>
                        <option value="" selected>Any</option>
                        { CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                    <div className="grid grid-cols-2 items-center justify-items-start mt-2">
                        <label htmlFor="actionableOnly" className="text-sm font-medium cursor-pointer">Actionable Only</label>
                        <input type="checkbox" id="actionableOnly" className="w-4 h-4 cursor-pointer" onChange={(e) => setFilters((prev) => ({ ...prev, actionableOnly: e.target.checked }))} />
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <button onClick={handleClearFilters}
                            className="w-full rounded-md bg-primary/20 px-4 py-2 text-white hover:opacity-90 cursor-pointer">
                        Clear Filters
                    </button>
                    <button onClick={handleApplyFilters} className="w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 cursor-pointer">
                        Apply Filters
                    </button>
                </div>
            </div>
            <div className="w-full h-full bg-black/25 absolute" onClick={() => setShowFilters(false)}>

            </div>
        </div>

    )
}