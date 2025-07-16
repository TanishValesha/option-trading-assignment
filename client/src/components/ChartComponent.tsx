// components/PayoffChart.tsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo } from 'react';
import type { PositionRow } from '@/lib/PositionType';

interface ChartComponentProps {
    positions: PositionRow[];
    spotPrice: number;
    lotSize?: number;
}

export const ChartComponent = ({ positions, spotPrice, lotSize = 35 }: ChartComponentProps) => {
    const totalPayoffs = useMemo(() => {
        const lowerBound = spotPrice - 3000;
        const upperBound = spotPrice + 3000;
        const steps = 200;

        const payoffs: [number, number][] = [];

        for (let i = 0; i <= steps; i++) {
            const price = lowerBound + (i / steps) * (upperBound - lowerBound);
            let total = 0;

            for (const pos of positions) {
                const lots = Math.abs(pos.qty / lotSize);
                const type = pos.type === 'call' ? 'CE' : 'PE';
                const premium = pos.entry;
                const positionType = pos.side; // 'BUY' or 'SELL'

                let singlePayoff = 0;

                if (type === 'CE') {
                    if (positionType === 'BUY') {
                        singlePayoff = Math.max(price - pos.strike, 0) - premium;
                    } else {
                        singlePayoff = premium - Math.max(price - pos.strike, 0);
                    }
                } else if (type === 'PE') {
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
            backgroundColor: '#3b3e47',
        },
        title: {
            text: 'Options Strategy Payoff Chart',
            style: { color: '#e0e0e0' },
        },
        xAxis: {
            title: {
                text: 'Underlying Price',
                style: { color: '#c0c0c0' },
            },
            labels: { style: { color: '#a0a0a0' } },
            lineColor: '#666a70',
            tickColor: '#666a70',
            plotLines: [
                {
                    value: spotPrice,
                    color: '#778899',
                    dashStyle: 'ShortDash',
                    width: 2,
                    label: {
                        text: `Spot Price: ${spotPrice.toFixed(2)}`,
                        style: { color: '#98c379' },
                    },
                },
            ],
        },
        yAxis: {
            title: {
                text: 'Profit / Loss',
                style: { color: '#c0c0c0' },
            },
            labels: { style: { color: '#a0a0a0' } },
            gridLineColor: '#4c5059',
            plotLines: [
                {
                    value: 0,
                    color: '#b0b0b0',
                    width: 2,
                    zIndex: 4,
                },
            ],
        },
        tooltip: {
            backgroundColor: 'rgba(59, 62, 71, 0.85)',
            style: { color: '#e0e0e0' },
            pointFormat: 'Price: <b>{point.x:.2f}</b><br/>P&L: <b>{point.y:.2f}</b>',
        },
        series: [
            {
                type: 'area',
                name: 'Payoff',
                data: totalPayoffs,
                color: '#98c379',
                negativeColor: '#e06c75',
                threshold: 0,
                marker: { enabled: false },
                fillOpacity: 0.3,
            },
        ],
        credits: { enabled: false },
        legend: { enabled: false },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
