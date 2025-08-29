import React from 'react';
import ApexCharts from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts'; // Import ApexOptions for type safety

// Assuming these types are defined in a shared types file or directly in IndexPlay/CandlestickChart's parent
interface CandlestickData {
    x: string; // Timestamp
    y: [number, number, number, number]; // [Open, High, Low, Close]
}

// Import calculation functions from your utility file
// Make sure the utility file also exports these functions with proper types
// import {
//     calculateSMA,
//     calculateEMA,
//     calculatePSAR
// } from '../../lib/chartCalculations'; // Adjust path if necessary

interface CandlestickChartProps {
    currentChartData: CandlestickData[]; // Use the specific type here
    indicatorStates: {
        sma: { [key: string]: boolean };
        ema: { [key: string]: boolean };
        psar: boolean;
    };
    indicatorColors: { [key: string]: string };
    VISIBLE_WINDOW_SIZE: number;
    // Explicitly type the calculation functions passed as props
    calculateSMA: (data: CandlestickData[], period: number) => { x: string; y: number | null }[];
    calculateEMA: (data: CandlestickData[], period: number) => { x: string; y: number | null }[];
    calculatePSAR: (data: CandlestickData[], initialAF?: number, maxAF?: number, afStep?: number) => { x: string; y: number | null }[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
    currentChartData,
    indicatorStates,
    indicatorColors,
    VISIBLE_WINDOW_SIZE,
    calculateSMA, // Destructure the functions from props
    calculateEMA,
    calculatePSAR
}) => {

    // Define the type for ApexCharts series using the ApexOptions['series'] union type
    const chartSeries: ApexOptions['series'] = [{
        name: 'Candles',
        data: currentChartData,
        type: 'candlestick'
    }];

    // Add SMA series if enabled
    for (const period of ['9', '13', '21', '50', '200']) {
        const numPeriod = parseInt(period);
        if (indicatorStates.sma[period] && currentChartData.length >= numPeriod) {
            const smaData = calculateSMA(currentChartData, numPeriod);
            chartSeries.push({
                name: `${period} SMA`,
                data: smaData,
                type: 'line',
                color: indicatorColors[`SMA_${period}`]
            });
        }
    }

    // Add EMA series if enabled
    for (const period of ['9', '13', '21', '50', '200']) {
        const numPeriod = parseInt(period);
        if (indicatorStates.ema[period] && currentChartData.length >= numPeriod) {
            const emaData = calculateEMA(currentChartData, numPeriod);
            chartSeries.push({
                name: `${period} EMA`,
                data: emaData,
                type: 'line',
                color: indicatorColors[`EMA_${period}`]
            });
        }
    }

    // Add PSAR series if enabled
    if (indicatorStates.psar && currentChartData.length >= 2) {
        const psarData = calculatePSAR(currentChartData);
        chartSeries.push({
            name: 'PSAR',
            data: psarData,
            type: 'scatter',
            //marker: { size: 3 },
            color: indicatorColors['PSAR']
        });
    }

    let xaxisMin: number | undefined = undefined;
    let xaxisMax: number | undefined = undefined;

    if (currentChartData.length > VISIBLE_WINDOW_SIZE) {
        // Convert date strings to timestamps (numbers) for min/max
        xaxisMin = new Date(currentChartData[currentChartData.length - VISIBLE_WINDOW_SIZE].x).getTime();
        xaxisMax = new Date(currentChartData[currentChartData.length - 1].x).getTime();
    } else if (currentChartData.length > 0) {
        xaxisMin = new Date(currentChartData[0].x).getTime();
        xaxisMax = new Date(currentChartData[currentChartData.length - 1].x).getTime();
    }

    const chartOptions: ApexOptions = {
        chart: {
            type: 'candlestick',
            height: 600,
            background: '#2d3748',
            toolbar: { show: true },
            foreColor: '#a0aec0',
            // Corrected animations object: removed 'easing' as it's not a direct property here
            animations: { enabled: true, speed: 200 },
            zoom: { enabled: true, type: 'x' },
            // pan: { enabled: true }
        },
        title: { text: 'Price Action', align: 'left', style: { color: '#e2e8f0', fontSize: '16px' } },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#a0aec0' } },
            tooltip: { enabled: false },
            min: xaxisMin,
            max: xaxisMax
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: { colors: '#a0aec0' },
                formatter: (value: number) => { return value ? value.toFixed(0) : '' }
            }
        },
        grid: { borderColor: '#4a5568', strokeDashArray: 4 },
        plotOptions: {
            candlestick: {
                colors: { upward: '#10B981', downward: '#EF4444' },
                wick: { useFillColor: true }
            }
        },
        tooltip: { theme: 'dark' }
    };

    return (
        <div id="chart" className="rounded-lg">
            <ApexCharts options={chartOptions} series={chartSeries} type="candlestick" height={600} />
        </div>
    );
};

export default CandlestickChart;