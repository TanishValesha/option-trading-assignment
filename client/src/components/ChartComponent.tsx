// components/PayoffChart.tsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { PositionRow } from '@/lib/PositionType';

// interface Meta {
//     spot: number
// }

// interface ChartComponentProps {
//     positions: PositionRow[];
//     spotPrice: number;
//     lotSize?: number;
//     theme?: 'light' | 'dark';
//     skips: number;
// }

// export const ChartComponent = ({ positions, spotPrice, lotSize = 35, theme = 'light', skips }: ChartComponentProps) => {
//     // console.log(spotPrice);
//     console.log(skips);

//     const isDark = theme === 'dark';

//     const totalPayoffs = useMemo(() => {
//         const lowerBound = spotPrice - skips;
//         const upperBound = spotPrice + skips;
//         const steps = 10;

//         const payoffs: [number, number][] = [];

//         for (let i = 0; i <= steps; i++) {
//             const price = lowerBound + (i / steps) * (upperBound - lowerBound);
//             let total = 0;

//             for (const pos of positions) {
//                 const lots = Math.abs(pos.qty / lotSize);
//                 const type = pos.type === 'call' ? 'Call' : 'Put';
//                 const premium = pos.entry;
//                 const positionType = pos.side;

//                 let singlePayoff = 0;

//                 if (type === 'Call') {
//                     if (positionType === 'BUY') {
//                         singlePayoff = Math.max(price - pos.strike, 0) - premium;
//                     } else {
//                         singlePayoff = premium - Math.max(price - pos.strike, 0);
//                     }
//                 } else if (type === 'Put') {
//                     if (positionType === 'BUY') {
//                         singlePayoff = Math.max(pos.strike - price, 0) - premium;
//                     } else {
//                         singlePayoff = premium - Math.max(pos.strike - price, 0);
//                     }
//                 }

//                 total += singlePayoff * lots * lotSize;
//             }

//             payoffs.push([+price.toFixed(2), +total.toFixed(2)]);

//         }
//         console.log("Payoffs:", payoffs);

//         return payoffs;
//     }, [positions, spotPrice, lotSize, skips]);

//     const options: Highcharts.Options = {
//         chart: {
//             type: 'area',
//             backgroundColor: isDark ? '#1F1F1F' : '#ffffff', // Dark: gray-800, Light: white
//         },
//         title: {
//             text: 'Options Strategy Payoff Chart',
//             style: { color: isDark ? '#f3f4f6' : '#000000' }, // Dark: gray-100, Light: black
//         },
//         xAxis: {
//             title: {
//                 text: 'Underlying Price',
//                 style: { color: isDark ? '#d1d5db' : '#333333' }, // Dark: gray-300, Light: dark gray
//             },
//             labels: { style: { color: isDark ? '#9ca3af' : '#555555' } }, // Dark: gray-400, Light: medium gray
//             lineColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
//             tickColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
//             plotLines: [
//                 {
//                     value: spotPrice,
//                     color: isDark ? '#f3f4f6' : '#000000', // Dark: gray-100, Light: black
//                     dashStyle: 'ShortDash',
//                     width: 2,
//                     label: {
//                         text: `Spot Price: ${spotPrice.toFixed(2)}`,
//                         style: { color: isDark ? '#f3f4f6' : '#000000' },
//                     },
//                 },
//             ],
//         },
//         yAxis: {
//             title: {
//                 text: 'Profit / Loss',
//                 style: { color: isDark ? '#d1d5db' : '#333333' }, // Dark: gray-300, Light: dark gray
//             },
//             labels: { style: { color: isDark ? '#9ca3af' : '#555555' } }, // Dark: gray-400, Light: medium gray
//             gridLineColor: isDark ? '#374151' : '#e0e0e0', // Dark: gray-700, Light: light gray
//             plotLines: [
//                 {
//                     value: 0,
//                     color: isDark ? '#6b7280' : '#888888', // Dark: gray-500, Light: medium gray
//                     width: 2,
//                     zIndex: 4,
//                 },
//             ],
//         },
//         tooltip: {
//             backgroundColor: isDark ? '#374151' : '#ffffff', // Dark: gray-700, Light: white
//             style: { color: isDark ? '#f3f4f6' : '#000000' }, // Dark: gray-100, Light: black
//             borderColor: isDark ? '#4b5563' : '#cccccc', // Dark: gray-600, Light: light gray
//             pointFormat: 'Price: <b>{point.x:.2f}</b><br/>P&L: <b>{point.y:.2f}</b>',
//         },
//         series: [
//             {
//                 type: 'area',
//                 name: 'Payoff',
//                 data: totalPayoffs,
//                 color: isDark ? '#22c55e' : '#28a745', // Dark: green-500, Light: success green
//                 negativeColor: isDark ? '#ef4444' : '#dc3545', // Dark: red-500, Light: danger red
//                 threshold: 0,
//                 marker: { enabled: false },
//                 fillOpacity: 0.2,
//             },
//         ],
//         credits: { enabled: false },
//         legend: { enabled: false },
//     };

//     return <HighchartsReact highcharts={Highcharts} options={options} />;
// };

// import React, { useMemo } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// const ChartComponent = ({ positions, spotPrice }: { positions: any[]; spotPrice: number }) => {
//     const { chartOptions, metrics } = useMemo(() => {
//         if (positions.length === 0) {
//             return { chartOptions: null, metrics: null };
//         }

//         const payoffData = [];
//         const lowerBound = spotPrice * 0.85;
//         const upperBound = spotPrice * 1.15;
//         const steps = 400;

//         for (let i = 0; i <= steps; i++) {
//             const price = lowerBound + (i / steps) * (upperBound - lowerBound);
//             let pnl = 0;
//             positions.forEach(opt => {
//                 let singlePnl = 0;
//                 if (opt.type === 'call') {
//                     singlePnl = Math.max(0, price - opt.strike) - opt.entry;
//                 } else { // PE
//                     singlePnl = Math.max(0, opt.strike - price) - opt.entry;
//                 }
//                 if (opt.positionType === 'SELL') singlePnl *= -1;
//                 pnl += singlePnl * opt.qty;
//             });
//             payoffData.push([price, pnl]);
//         }

//         // --- Calculate Metrics ---
//         let maxProfit = -Infinity;
//         payoffData.forEach(point => { if (point[1] > maxProfit) maxProfit = point[1]; });

//         const netCalls = positions.filter(p => p.type === 'call').reduce((sum, p) => sum + (p.positionType === 'BUY' ? p.lots : -p.lots), 0);
//         const displayMaxProfit = netCalls > 0 ? 'Unlimited' : `₹${maxProfit.toFixed(2)}`;
//         const displayMaxLoss = 'Unlimited'; // Per original logic

//         const breakevens = [];
//         for (let i = 0; i < payoffData.length - 1; i++) {
//             const [p1_price, p1_pnl] = payoffData[i];
//             const [p2_price, p2_pnl] = payoffData[i + 1];
//             if (Math.sign(p1_pnl) !== Math.sign(p2_pnl)) {
//                 const breakeven = p1_price - p1_pnl * (p2_price - p1_price) / (p2_pnl - p1_pnl);
//                 breakevens.push(breakeven.toFixed(2));
//             }
//         }
//         const beText = breakevens.length > 0 ? [...new Set(breakevens)].join(', ') : 'N/A';

//         const calculatedMetrics = {
//             maxProfit: displayMaxProfit,
//             maxLoss: displayMaxLoss,
//             breakevens: beText
//         };

//         const options = {
//             chart: { type: 'area', backgroundColor: '#3b3e47' },
//             title: { text: null },
//             xAxis: {
//                 title: { text: 'Underlying Price', style: { color: '#c0c0c0' } },
//                 labels: { style: { color: '#a0a0a0' } },
//                 plotLines: [{ value: spotPrice, color: '#778899', dashStyle: 'ShortDash', width: 2, zIndex: 5, label: { text: `Spot: ${spotPrice.toFixed(2)}`, style: { color: '#98c379' } } }]
//             },
//             yAxis: {
//                 title: { text: 'Profit / Loss', style: { color: '#c0c0c0' } },
//                 labels: { style: { color: '#a0a0a0' }, formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) { return '₹' + this.value; } },
//                 gridLineColor: '#4c5059',
//                 plotLines: [{ value: 0, color: '#b0b0b0', width: 2, zIndex: 4 }]
//             },
//             tooltip: { backgroundColor: 'rgba(59, 62, 71, 0.85)', style: { color: '#e0e0e0' }, pointFormat: 'Price: <b>{point.x:,.2f}</b><br/>P&L: <b>₹{point.y:,.2f}</b>' },
//             series: [{ name: 'Payoff', data: payoffData, color: '#98c379', negativeColor: '#e06c75', threshold: 0, marker: { enabled: false }, fillOpacity: 0.3 }],
//             credits: { enabled: false }, legend: { enabled: false }
//         };

//         return { chartOptions: options, metrics: calculatedMetrics };

//     }, [positions, spotPrice]);

//     return (
//         <div className="chart-section">
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h2>Options Payoff Chart</h2>
//                 {metrics && (
//                     <div className="strategy-metrics">
//                         <span className="profit">Max Profit: {metrics.maxProfit}</span> |
//                         <span className="loss">Max Loss: {metrics.maxLoss}</span> |
//                         <span className="breakeven">Breakeven(s): {metrics.breakevens}</span>
//                     </div>
//                 )}
//             </div>
//             {chartOptions ? (
//                 <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//             ) : (
//                 <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <p>Add positions to see the payoff chart.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChartComponent;

// src/components/PayoffChart.tsx

interface PayoffChartProps {
    positions: PositionRow[];
    spotPrice: number;
}

const ChartComponent: React.FC<PayoffChartProps> = ({ positions, spotPrice }) => {

    const { chartOptions } = useMemo(() => {
        // if (positions.length === 0) {
        //     onMetricsCalculated({ maxProfit: '', maxLoss: '', breakevens: '' });
        //     return { chartOptions: null };
        // }

        const payoffData: [number, number][] = [];
        const lowerBound = spotPrice * 0.85;
        const upperBound = spotPrice * 1.15;
        const steps = 400;

        for (let i = 0; i <= steps; i++) {
            const price = lowerBound + (i / steps) * (upperBound - lowerBound);
            let pnl = 0;
            positions.forEach(opt => {
                let singlePnl = 0;
                if (opt.type === 'call') {
                    singlePnl = Math.max(0, price - opt.strike) - opt.entry;
                } else { // PE
                    singlePnl = Math.max(0, opt.strike - price) - opt.entry;
                }
                if (opt.side === 'SELL') singlePnl *= -1;
                pnl += singlePnl * opt.qty;
            });
            payoffData.push([price, pnl]);
        }

        // --- Calculate Metrics ---
        let maxProfit = -Infinity;
        payoffData.forEach(point => { if (point[1] > maxProfit) maxProfit = point[1]; });

        // let displayMaxLoss = 'Unlimited'; // Default
        // let displayMaxProfit;

        const netCalls = positions.filter(p => p.type === 'call').reduce((sum, p) => sum + (p.side === 'BUY' ? p.lotNo : -p.lotNo), 0);
        if (netCalls > 0) {
            // displayMaxProfit = 'Unlimited';
        } else {
            // displayMaxProfit = `₹${maxProfit.toFixed(2)}`;
        }

        const breakevens: string[] = [];
        for (let i = 0; i < payoffData.length - 1; i++) {
            const [p1_price, p1_pnl] = payoffData[i];
            const [p2_price, p2_pnl] = payoffData[i + 1];
            if (Math.sign(p1_pnl) !== Math.sign(p2_pnl)) {
                const breakeven = p1_price - p1_pnl * (p2_price - p1_price) / (p2_pnl - p1_pnl);
                breakevens.push(breakeven.toFixed(2));
            }
        }

        // onMetricsCalculated({
        //     maxProfit: displayMaxProfit,
        //     maxLoss: displayMaxLoss,
        //     breakevens: breakevens.length > 0 ? [...new Set(breakevens)].join(', ') : 'N/A'
        // });

        const options: Highcharts.Options = {
            chart: { type: 'area', backgroundColor: '#1F1F1F' },
            title: { text: 'Options Chart', style: { color: '#ffffff' } },
            xAxis: {
                title: { text: 'Underlying Price', style: { color: '#c0c0c0' } },
                labels: { style: { color: '#a0a0a0' } },
                plotLines: [{ value: spotPrice, color: '#778899', dashStyle: 'ShortDash', width: 2, zIndex: 5, label: { text: `Spot: ${spotPrice.toFixed(2)}`, style: { color: '#98c379' } } }]
            },
            yAxis: {
                title: { text: 'Profit / Loss', style: { color: '#c0c0c0' } },
                labels: { style: { color: '#a0a0a0' }, formatter: function () { return '₹' + this.value; } },
                gridLineColor: '#4c5059',
                plotLines: [{ value: 0, color: '#b0b0b0', width: 2, zIndex: 4 }]
            },
            tooltip: { backgroundColor: 'rgba(59, 62, 71, 0.85)', style: { color: '#e0e0e0' }, pointFormat: 'Price: <b>{point.x:,.2f}</b><br/>P&L: <b>₹{point.y:,.2f}</b>' },
            series: [{ name: 'Payoff', type: 'area', data: payoffData, color: '#00c950', negativeColor: '#FF0000', threshold: 0, marker: { enabled: false }, fillOpacity: 0.3 }],
            credits: { enabled: false }, legend: { enabled: false }
        };

        return { chartOptions: options };

    }, [positions, spotPrice]);

    if (!chartOptions) {
        return <div className="right-panel-item"><h2>Options Payoff Chart</h2></div>;
    }

    return (
        <div className="right-panel-item">
            <h2>Options Payoff Chart</h2>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default ChartComponent;