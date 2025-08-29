import StockWatchlist from '@/components/TechnicalAnalysis/StockWatchList';
import { baseURL } from '@/lib/baseURL';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

interface WatchlistStock {
    id: string;
    ticker: string;
    adj_close?: number;
    change_percent?: number;
    // price: number;
    // change: number;
    // changePercent: number;
    // previousClose?: number;
}

interface TechAnalysisProps {
    selectedStock: string;
    setSelectedStock: React.Dispatch<React.SetStateAction<string>>;
}

const TechAnalysis = ({ setSelectedStock }: TechAnalysisProps) => {
    const [, setLoading] = useState(false);
    const [watchlists, setWatchlists] = useState<WatchlistStock[]>([]);

    const authToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            console.log('Fetching watchlist...');
            const res = await fetch(`${baseURL}/watchlist/get`, {
                headers: {
                    Authorization: `Bearer ${await authToken()}`
                }
            });

            const data = await res.json();
            console.log('Watchlist response:', data);

            if (data?.watchlist) {
                setWatchlists(data.watchlist);
            }
            if (data?.watchlist) {
                const tickers = data.watchlist.map((w: WatchlistStock) => w.ticker);

                // fetch today's stock data for all tickers in parallel
                const stockResults = await Promise.all(
                    tickers.map(async (ticker: string) => {
                        try {
                            const res = await fetch(`${baseURL}/watchlist/today/${ticker}`, {
                                headers: {
                                    Authorization: `Bearer ${await authToken()}`,
                                    "Content-Type": "application/json",
                                },
                            });

                            if (!res.ok) throw new Error("Failed to fetch stock data");

                            const stockData = await res.json();
                            return { ticker, ...stockData };
                        } catch (err) {
                            console.error(`Error fetching stock data for ${ticker}`, err);
                            return { ticker };
                        }
                    })
                );

                // merge stock info into watchlist
                const merged = data.watchlist.map((w: WatchlistStock) => {
                    const stock = stockResults.find((s) => s.ticker === w.ticker);
                    return { ...w, ...stock };
                });

                setWatchlists(merged);

            }

        } catch (err) {
            console.error('Error fetching watchlist:', err);
        } finally {
            setLoading(false);
        }
    };

    // 1. Fetch watchlist on mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    // 2. Handle adding a stock via backend API
    const handleAddStock = async (ticker: string) => {
        try {
            const res = await fetch(`${baseURL}/watchlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await authToken()}`
                },
                body: JSON.stringify({ ticker: ticker.toUpperCase() })
            });

            const data = await res.json();

            fetchWishlist();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add stock');
            }

            // Update local state with returned watchlist entry
            setWatchlists((prev) => [...prev, data.watchlist]);
        } catch (err) {
            console.error('Error adding stock:', err);
        }
    };

    // 3. Handle removing a stock (if you have an API for this, call it here instead of only local state)
    const handleDeleteStock = async (id: string) => {
        try {
            const token = await authToken();
            await fetch(`${baseURL}/watchlist/delete`, {
                method: "POST", // or "DELETE" if your backend expects DELETE
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: id }),
            });

            // re-fetch watchlist after deleting
            fetchWishlist();
        } catch (err) {
            console.error("Error deleting stock:", err);
        }
    };


    return (
        <div className="h-full bg-[#111] text-white">
            <StockWatchlist
                watchlists={watchlists}
                onStockSelect={setSelectedStock}
                onAddStock={handleAddStock}
                onRemoveStock={handleDeleteStock}
            />
        </div>
    );
};

export default TechAnalysis;
