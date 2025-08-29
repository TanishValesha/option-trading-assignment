// src/components/StockGrid.tsx
import React from 'react';
import StockCard from './StockCard';
import type { Stock } from '../../../types'; // Import the Stock type

interface StockGridProps {
    stocks: Stock[];
}

const StockGrid: React.FC<StockGridProps> = ({ stocks }) => {
    return (
        <main id="stock-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
};

export default StockGrid;