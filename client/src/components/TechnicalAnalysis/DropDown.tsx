"use client";

import React, { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // helper for classNames

import stockList from '../../../data/stockList.json' // your static JSON

interface StockSearchDropdownProps {
    selectedStock: string;
    setSelectedStock: React.Dispatch<React.SetStateAction<string>>;
}

export default function StockSearchDropdown({ selectedStock, setSelectedStock }: StockSearchDropdownProps) {
    const [stocks, setStocks] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setStocks(stockList); // load from JSON
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-64 justify-between"
                >
                    {selectedStock || "Select stock..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
                <Command>
                    <CommandInput placeholder="Search stock..." />
                    <CommandList>
                        <CommandEmpty>No stock found.</CommandEmpty>
                        <CommandGroup>
                            {stocks.map((stock) => (
                                <CommandItem
                                    key={stock}
                                    value={stock}
                                    onSelect={(currentValue) => {
                                        setSelectedStock(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedStock === stock ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {stock}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
