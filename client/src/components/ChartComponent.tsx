// components/PayoffChart.tsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { PositionRow } from '@/lib/PositionType';

// interface Meta {
//     spot: number
// }

interface ChartComponentProps {
    positions: PositionRow[];
    spotPrice: number;
    lotSize?: number;
    theme?: 'light' | 'dark';
    skips: number;
}

export const ChartComponent = ({ positions, spotPrice, lotSize = 35, theme = 'light', skips }: ChartComponentProps) => {
    // console.log(spotPrice);
    console.log(skips);

    const isDark = theme === 'dark';

    const totalPayoffs = useMemo(() => {
        const lowerBound = spotPrice - skips;
        const upperBound = spotPrice + skips;
        const steps = 100;

        const payoffs: [number, number][] = [];

        for (let i = 0; i <= steps; i++) {
            const price = lowerBound + (i / steps) * (upperBound - lowerBound);
            let total = 0;

            for (const pos of positions) {
                const lots = Math.abs(pos.qty / lotSize);
                const type = pos.type === 'call' ? 'Call' : 'Put';
                const premium = pos.entry;
                const positionType = pos.side;

                let singlePayoff = 0;

                if (type === 'Call') {
                    if (positionType === 'BUY') {
                        singlePayoff = Math.max(price - pos.strike, 0) - premium;
                    } else {
                        singlePayoff = premium - Math.max(price - pos.strike, 0);
                    }
                } else if (type === 'Put') {
                    if (positionType === 'BUY') {
                        singlePayoff = Math.max(pos.strike - price, 0) - premium;
                    } else {
                        singlePayoff = premium - Math.max(pos.strike - price, 0);
                    }
                }

                total += singlePayoff * lots * lotSize;
            }

            payoffs.push([+price.toFixed(2), +total.toFixed(2)]);
        }

        return payoffs;
    }, [positions, spotPrice, lotSize, skips]);

    const options: Highcharts.Options = {
        chart: {
            type: 'area',
            backgroundColor: isDark ? '#1f2937' : '#ffffff', // Dark: gray-800, Light: white
        },
        title: {
            text: 'Options Strategy Payoff Chart',
            style: { color: isDark ? '#f3f4f6' : '#000000' }, // Dark: gray-100, Light: black
        },
        xAxis: {
            title: {
                text: 'Underlying Price',
                style: { color: isDark ? '#d1d5db' : '#333333' }, // Dark: gray-300, Light: dark gray
            },
            labels: { style: { color: isDark ? '#9ca3af' : '#555555' } }, // Dark: gray-400, Light: medium gray
            lineColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
            tickColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
            plotLines: [
                {
                    value: spotPrice,
                    color: isDark ? '#f3f4f6' : '#000000', // Dark: gray-100, Light: black
                    dashStyle: 'ShortDash',
                    width: 2,
                    label: {
                        text: `Spot Price: ${spotPrice.toFixed(2)}`,
                        style: { color: isDark ? '#f3f4f6' : '#000000' },
                    },
                },
            ],
        },
        yAxis: {
            title: {
                text: 'Profit / Loss',
                style: { color: isDark ? '#d1d5db' : '#333333' }, // Dark: gray-300, Light: dark gray
            },
            labels: { style: { color: isDark ? '#9ca3af' : '#555555' } }, // Dark: gray-400, Light: medium gray
            gridLineColor: isDark ? '#374151' : '#e0e0e0', // Dark: gray-700, Light: light gray
            plotLines: [
                {
                    value: 0,
                    color: isDark ? '#6b7280' : '#888888', // Dark: gray-500, Light: medium gray
                    width: 2,
                    zIndex: 4,
                },
            ],
        },
        tooltip: {
            backgroundColor: isDark ? '#374151' : '#ffffff', // Dark: gray-700, Light: white
            style: { color: isDark ? '#f3f4f6' : '#000000' }, // Dark: gray-100, Light: black
            borderColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
            pointFormat: 'Price: <b>{point.x:.2f}</b><br/>P&L: <b>{point.y:.2f}</b>',
        },
        series: [
            {
                type: 'area',
                name: 'Payoff',
                data: totalPayoffs,
                color: isDark ? '#22c55e' : '#28a745', // Dark: green-500, Light: success green
                negativeColor: isDark ? '#ef4444' : '#dc3545', // Dark: red-500, Light: danger red
                threshold: 0,
                marker: { enabled: false },
                fillOpacity: 0.2,
            },
        ],
        credits: { enabled: false },
        legend: { enabled: false },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};