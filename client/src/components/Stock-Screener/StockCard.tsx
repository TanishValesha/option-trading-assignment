// src/components/StockCard.tsx
import React from 'react';
import type { Stock } from '../../../types'; // Import the Stock type

interface StockCardProps {
    stock: Stock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
    const isPositive = stock.change >= 0;
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const chartColor = isPositive ? '#22c55e' : '#ef4444'; // Tailwind green-500 and red-500 colors

    const changeSign = isPositive ? '+' : '';

    /**
     * Generates an SVG sparkline chart with a reference line for the previous day's close.
     * @param {number[]} data - Array of closing prices (the history).
     * @param {string} color - The color of the sparkline.
     * @param {number} prevDayClose - The closing price of the previous day for the reference line.
     * @returns {string} - The complete SVG string.
     */
    const generateSparkline = (data: number[], color: string, prevDayClose?: number): string => {
        const width = 120, height = 50, padding = 5;
        // Include prevDayClose in min/max calculation to ensure the reference line is always visible
        const allValues = prevDayClose ? [...data, prevDayClose] : data;
        const maxVal = Math.max(...allValues);
        const minVal = Math.min(...allValues);
        const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

        // Generate the main price line path
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - padding - ((d - minVal) / range) * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');

        // Calculate the Y position for the reference line
        let refLine = '';
        if (prevDayClose) {
            const refY = height - padding - ((prevDayClose - minVal) / range) * (height - 2 * padding);
            refLine = `<line x1="${padding}" y1="${refY}" x2="${width - padding}" y2="${refY}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2" />`;
        }

        // Combine the reference line and the price line in the SVG
        return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="w-full h-16 mt-auto">
                    ${refLine}
                    <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
                </svg>`;
    };

    return (
        <div className="card-bg p-5 flex flex-col shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 transition-all duration-300 rounded">
            <div className="flex-grow">
                <h2 className="text-lg font-semibold text-white">{stock.symbol}</h2>
                <p className={`text-3xl font-bold ${colorClass} mt-2 mb-4`}>
                    {changeSign}{stock.change.toFixed(2)}%
                </p>
            </div>
            {/* dangerouslySetInnerHTML is used here because generateSparkline returns an SVG string */}
            <div dangerouslySetInnerHTML={{ __html: generateSparkline(stock.history, chartColor, stock.prev_day_close) }} />
        </div>
    );
};

export default StockCard;