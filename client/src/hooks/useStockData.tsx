// src/hooks/useStockData.ts
import { useState, useEffect, useCallback } from 'react';
import type { Stock, SortState, SortKey } from '../../types/index';
import { cleanIndexNameForFilename } from '../lib/helper';
import { toast } from 'sonner'; // Using sonner for toasts

// Dynamically import all JSON files from the preprocessed_data directory
// Webpack/Vite will process this 'glob' import.
const stockDataModules = import.meta.glob('../../preprocessed_data/*.json', { eager: true });

console.log(stockDataModules);



// Import the indices list directly
import allIndices from '../../data/indicies.json'; // Ensure this file exists at src/data/indices.json

export function useStockData() {
    const [allFetchedStocks, setAllFetchedStocks] = useState<Stock[]>([]);
    const [displayedStocks, setDisplayedStocks] = useState<Stock[]>([]);
    const [indices, setIndices] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentSort, setCurrentSort] = useState<SortState>({ key: 'symbol', order: 'asc' });
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const showMessage = useCallback((text: string) => {
        setDisplayedStocks([]); // Clear stocks when showing a message
        setMessage(text);
    }, []);

    // Function to load stock data based on selected index
    const loadStockData = useCallback((indexName: string) => {
        if (!indexName) {
            setAllFetchedStocks([]);
            return;
        }

        const filename = `${cleanIndexNameForFilename(indexName)}_stocks.json`;
        const modulePath = `../../preprocessed_data/${filename}`;

        let foundModuleKey: string | undefined;

        for (const key in stockDataModules) {
            if (key.endsWith(modulePath)) {
                foundModuleKey = key;
                break;
            }
        }

        if (foundModuleKey) {
            const dataModule = stockDataModules[foundModuleKey];

            if (dataModule && typeof dataModule === 'object' && 'default' in dataModule) {
                const rawData = (dataModule as { default: unknown }).default; // Use unknown first

                // --- START IMPORTANT ADDITION/CHANGE ---
                // Validate that rawData is an array of Stock objects
                const isStockArray = (arr: unknown): arr is Stock[] =>
                    Array.isArray(arr) &&
                    arr.every(
                        (item): item is Stock =>
                            typeof item === 'object' &&
                            item !== null &&
                            'symbol' in item &&
                            'change' in item &&
                            'history' in item
                    );

                if (isStockArray(rawData)) {
                    const data: Stock[] = rawData;
                    setAllFetchedStocks(data);
                    setMessage('');
                    console.log(`Successfully loaded ${data.length} stocks for ${indexName} from key: ${foundModuleKey}.`);
                } else {
                    console.error(`Error: Data for ${indexName} at ${foundModuleKey} is not an array of expected Stock objects. Received:`, rawData);
                    toast.error("Data Format Error", {
                        description: `Data for ${indexName} is malformed. Expected an array of stock objects.`,
                    });
                    showMessage(`Error: Invalid data format for ${indexName}. Expected an array of stocks.`);
                    setAllFetchedStocks([]);
                }
                // --- END IMPORTANT ADDITION/CHANGE ---

            } else {
                console.error(`Error: Data module format incorrect for ${indexName} at ${foundModuleKey}. Expected 'default' export.`, dataModule);
                toast.error("Data Load Error", {
                    description: `Data for ${indexName} is not in the expected format from ${foundModuleKey}.`,
                });
                showMessage(`Error: Invalid data format for ${indexName}.`);
                setAllFetchedStocks([]);
            }
        } else {
            console.error(`Error: Could not find module for ${indexName}. Generated filename: '${filename}'. Expected suffix: '${modulePath}'. Available keys:`, Object.keys(stockDataModules));
            toast.error("Data Not Found", {
                description: `Could not find data file for ${indexName}. Please ensure its name is correct and it's in the 'src/data/preprocessed_data/' folder.`,
            });
            showMessage(`Error: Data file not found for ${indexName}.`);
            setAllFetchedStocks([]);
        }
    }, [showMessage]);

    // Effect to run on initial load to populate indices and load default stock data
    useEffect(() => {
        setIndices(allIndices); // Set indices from the imported JSON
        if (allIndices.length > 0) {
            setSelectedIndex(allIndices[0]); // Set default selected index
            loadStockData(allIndices[0]); // Load data for the first index
        } else {
            showMessage("No index data found. Please ensure 'src/data/indices.json' is correctly populated.");
            toast.warning("No Indices", {
                description: "The list of available indices is empty. Check your 'indices.json' file.",
            });
        }
    }, [loadStockData, showMessage]); // Only runs once on mount

    // Effect to re-load stock data when selectedIndex changes
    useEffect(() => {
        if (selectedIndex) {
            setLoading(true); // Indicate loading when switching indices
            loadStockData(selectedIndex);
            setLoading(false);
        }
    }, [selectedIndex, loadStockData]);


    // Effect to filter and sort whenever allFetchedStocks, searchTerm, or currentSort changes
    useEffect(() => {
        const filtered = allFetchedStocks.filter(stock =>
            stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (currentSort.key === 'symbol') {
                return currentSort.order === 'asc'
                    ? a.symbol.localeCompare(b.symbol)
                    : b.symbol.localeCompare(a.symbol);
            } else if (currentSort.key === 'change') {
                return currentSort.order === 'asc'
                    ? a.change - b.change
                    : b.change - a.change;
            }
            return 0;
        });

        setDisplayedStocks(filtered);

        // Manage messages based on filter results
        if (!loading && !message) { // Only show 'No stocks' if not loading and no other active message
            if (allFetchedStocks.length > 0 && filtered.length === 0) {
                setMessage('No stocks match your search criteria.');
            } else if (allFetchedStocks.length === 0 && !selectedIndex) {
                // Initial state where no index is selected yet or no data at all
                setMessage('Select an index to view stocks.');
            }
        }
        // If stocks appear after a 'no match' message, clear it
        if (filtered.length > 0 && message === 'No stocks match your search criteria.') {
            setMessage('');
        }

    }, [allFetchedStocks, searchTerm, currentSort, loading, message, selectedIndex]);

    const handleSort = (key: SortKey) => {
        setCurrentSort(prevSort => {
            if (prevSort.key === key) {
                return { ...prevSort, order: prevSort.order === 'asc' ? 'desc' : 'asc' };
            } else {
                return { key, order: key === 'change' ? 'desc' : 'asc' }; // Default change to desc (high to low)
            }
        });
    };

    return {
        displayedStocks,
        indices,
        selectedIndex,
        setSelectedIndex,
        searchTerm,
        setSearchTerm,
        currentSort,
        handleSort,
        message,
        loading,
    };
}