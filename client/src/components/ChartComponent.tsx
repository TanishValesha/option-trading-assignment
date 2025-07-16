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
}

export const ChartComponent = ({ positions, spotPrice, lotSize = 35 }: ChartComponentProps) => {
    console.log(spotPrice);

    const totalPayoffs = useMemo(() => {
        const lowerBound = spotPrice - 2000;
        const upperBound = spotPrice + 2000;
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
    }, [positions, spotPrice, lotSize]);

    const options: Highcharts.Options = {
        chart: {
            type: 'area',
            backgroundColor: '#ffffff', // Light background
        },
        title: {
            text: 'Options Strategy Payoff Chart',
            style: { color: '#000000' }, // Dark title
        },
        xAxis: {
            title: {
                text: 'Underlying Price',
                style: { color: '#333333' }, // Dark label
            },
            labels: { style: { color: '#555555' } },
            lineColor: '#cccccc',
            tickColor: '#cccccc',
            plotLines: [
                {
                    value: spotPrice,
                    color: '#000000', // Spot price line
                    dashStyle: 'ShortDash',
                    width: 2,
                    label: {
                        text: `Spot Price: ${spotPrice.toFixed(2)}`,
                        style: { color: '#000000' },
                    },
                },
            ],
        },
        yAxis: {
            title: {
                text: 'Profit / Loss',
                style: { color: '#333333' },
            },
            labels: { style: { color: '#555555' } },
            gridLineColor: '#e0e0e0',
            plotLines: [
                {
                    value: 0,
                    color: '#888888', // Neutral zero line
                    width: 2,
                    zIndex: 4,
                },
            ],
        },
        tooltip: {
            backgroundColor: '#ffffff',
            style: { color: '#000000' },
            borderColor: '#cccccc',
            pointFormat: 'Price: <b>{point.x:.2f}</b><br/>P&L: <b>{point.y:.2f}</b>',
        },
        series: [
            {
                type: 'area',
                name: 'Payoff',
                data: totalPayoffs,
                color: '#28a745',
                negativeColor: '#dc3545',
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
