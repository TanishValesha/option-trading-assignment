import { CandlestickSeries, createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
// import { Button } from '@/components/ui/button';
import { baseURL } from '@/lib/baseURL';
import stocklist from '../../../data/stockList.json'
import StockSearchDropdown from './DropDown';

const colors = {
    white: "#f0f0f0",
    black: "#080F25",
    red: "#ff6b6b",
    blue100: "#0E43FB",
    blue200: "#101935",
    blue: "#AEB9E1",
    gray: "#7E89AC",
    gray100: "#343B4F",
    cyan: "#57C3FF",
    violet: "#8951FF",
    pink: "#cb3cff",
    green: "#28a49c",
    orange: "#FFB74D",
    orange100: "#CC5500",
} as const;


// const dayData = [
//     { time: "2019-05-01", open: 185.12, high: 188.44, low: 183.56, close: 187.21 },
//     { time: "2019-05-02", open: 187.30, high: 189.77, low: 185.88, close: 188.55 },
//     { time: "2019-05-03", open: 188.70, high: 191.22, low: 187.01, close: 190.44 },
//     { time: "2019-05-04", open: 190.50, high: 192.88, low: 188.77, close: 191.05 },
//     { time: "2019-05-05", open: 191.20, high: 193.66, low: 189.42, close: 192.18 },
//     { time: "2019-05-06", open: 192.40, high: 194.22, low: 190.22, close: 191.66 },
//     { time: "2019-05-07", open: 191.55, high: 193.99, low: 189.77, close: 192.22 },
//     { time: "2019-05-08", open: 192.10, high: 194.88, low: 190.56, close: 193.33 },
//     { time: "2019-05-09", open: 193.20, high: 195.66, low: 191.42, close: 194.22 },
//     { time: "2019-05-10", open: 194.50, high: 196.33, low: 192.88, close: 195.05 },
//     { time: "2019-05-11", open: 195.10, high: 197.44, low: 193.56, close: 196.40 },
//     { time: "2019-05-12", open: 196.22, high: 198.77, low: 194.88, close: 197.18 },
//     { time: "2019-05-13", open: 197.40, high: 199.22, low: 195.22, close: 196.55 },
//     { time: "2019-05-14", open: 196.10, high: 198.66, low: 194.42, close: 197.77 },
//     { time: "2019-05-15", open: 197.80, high: 200.10, low: 195.55, close: 198.99 },
//     { time: "2019-05-16", open: 199.20, high: 201.42, low: 197.66, close: 200.18 },
//     { time: "2019-05-17", open: 200.10, high: 202.22, low: 198.05, close: 201.05 },
//     { time: "2019-05-18", open: 200.88, high: 203.44, low: 199.12, close: 202.55 },
//     { time: "2019-05-19", open: 202.10, high: 204.66, low: 200.42, close: 203.77 },
//     { time: "2019-05-20", open: 189.12, high: 191.45, low: 187.56, close: 190.21 },
//     { time: "2019-05-21", open: 190.49, high: 192.22, low: 188.05, close: 188.91 },
//     { time: "2019-05-22", open: 188.75, high: 190.33, low: 186.22, close: 187.14 },
//     { time: "2019-05-23", open: 187.10, high: 189.66, low: 185.88, close: 188.42 },
//     { time: "2019-05-24", open: 188.90, high: 191.20, low: 187.01, close: 190.67 },
//     { time: "2019-05-25", open: 190.33, high: 192.55, low: 188.42, close: 191.22 },
//     { time: "2019-05-26", open: 191.66, high: 194.44, low: 190.11, close: 192.88 },
//     { time: "2019-05-27", open: 190.10, high: 193.42, low: 189.56, close: 192.18 },
//     { time: "2019-05-28", open: 192.40, high: 194.22, low: 190.88, close: 191.05 },
//     { time: "2019-05-29", open: 191.33, high: 192.89, low: 188.77, close: 189.44 },
//     { time: "2019-05-30", open: 189.50, high: 191.99, low: 187.42, close: 188.10 },
//     { time: "2019-05-31", open: 188.25, high: 190.10, low: 186.22, close: 187.77 },
// ];

// const weekData = [
//     { time: "2019-01-07", open: 150.22, high: 154.88, low: 148.42, close: 153.10 },
//     { time: "2019-01-14", open: 153.20, high: 156.55, low: 151.12, close: 154.77 },
//     { time: "2019-01-21", open: 154.90, high: 158.10, low: 152.44, close: 156.22 },
//     { time: "2019-01-28", open: 156.20, high: 159.42, low: 154.12, close: 158.55 },

//     { time: "2019-02-04", open: 158.80, high: 162.20, low: 157.22, close: 160.11 },
//     { time: "2019-02-11", open: 160.20, high: 164.22, low: 158.50, close: 162.88 },
//     { time: "2019-02-18", open: 163.00, high: 167.05, low: 161.22, close: 165.44 },
//     { time: "2019-02-25", open: 165.20, high: 169.10, low: 163.55, close: 167.77 },

//     { time: "2019-03-04", open: 167.90, high: 171.22, low: 165.88, close: 170.05 },
//     { time: "2019-03-11", open: 170.40, high: 174.55, low: 168.66, close: 172.77 },
//     { time: "2019-03-18", open: 173.10, high: 176.88, low: 171.22, close: 175.22 },
//     { time: "2019-03-25", open: 175.40, high: 179.55, low: 173.42, close: 178.10 },

//     { time: "2019-04-01", open: 178.60, high: 182.10, low: 176.42, close: 181.22 },
//     { time: "2019-04-08", open: 181.40, high: 185.55, low: 179.22, close: 183.88 },
//     { time: "2019-04-15", open: 184.00, high: 188.42, low: 182.22, close: 186.77 },
//     { time: "2019-04-22", open: 186.50, high: 190.88, low: 184.66, close: 189.22 },
//     { time: "2019-04-29", open: 189.00, high: 193.22, low: 187.42, close: 191.55 },

//     { time: "2019-05-06", open: 189.12, high: 193.55, low: 187.42, close: 191.77 },
//     { time: "2019-05-13", open: 191.80, high: 195.21, low: 189.05, close: 193.66 },
//     { time: "2019-05-20", open: 193.40, high: 196.42, low: 190.12, close: 191.55 },
//     { time: "2019-05-27", open: 191.50, high: 194.60, low: 189.77, close: 192.22 },

//     { time: "2019-06-03", open: 192.20, high: 197.05, low: 190.66, close: 196.80 },
//     { time: "2019-06-10", open: 196.90, high: 199.55, low: 194.25, close: 197.88 },
//     { time: "2019-06-17", open: 198.20, high: 201.10, low: 196.42, close: 200.05 },
//     { time: "2019-06-24", open: 200.40, high: 203.22, low: 198.88, close: 202.18 },

//     { time: "2019-07-01", open: 202.10, high: 205.66, low: 200.55, close: 204.44 },
//     { time: "2019-07-08", open: 204.70, high: 208.22, low: 202.22, close: 207.10 },
//     { time: "2019-07-15", open: 207.50, high: 210.55, low: 205.55, close: 209.88 },
//     { time: "2019-07-22", open: 209.80, high: 213.20, low: 207.22, close: 212.55 },
//     { time: "2019-07-29", open: 212.40, high: 216.10, low: 210.42, close: 215.22 },

//     { time: "2019-08-05", open: 214.90, high: 218.55, low: 212.55, close: 217.44 },
//     { time: "2019-08-12", open: 217.20, high: 221.22, low: 215.42, close: 220.10 },
//     { time: "2019-08-19", open: 220.50, high: 224.55, low: 218.12, close: 223.55 },
//     { time: "2019-08-26", open: 223.80, high: 228.10, low: 221.55, close: 226.22 },

//     { time: "2019-09-02", open: 226.10, high: 229.55, low: 224.22, close: 228.77 },
//     { time: "2019-09-09", open: 229.20, high: 233.42, low: 227.55, close: 231.88 },
//     { time: "2019-09-16", open: 232.10, high: 236.55, low: 230.22, close: 235.10 },
//     { time: "2019-09-23", open: 235.40, high: 239.55, low: 233.12, close: 238.22 },
//     { time: "2019-09-30", open: 238.20, high: 242.55, low: 236.42, close: 241.77 },

//     { time: "2019-10-07", open: 241.50, high: 245.22, low: 239.12, close: 243.88 },
//     { time: "2019-10-14", open: 244.10, high: 248.55, low: 242.22, close: 246.55 },
//     { time: "2019-10-21", open: 246.90, high: 251.22, low: 245.10, close: 249.77 },
//     { time: "2019-10-28", open: 250.10, high: 254.42, low: 248.22, close: 252.66 },

//     { time: "2019-11-04", open: 252.40, high: 256.55, low: 250.55, close: 254.88 },
//     { time: "2019-11-11", open: 255.20, high: 259.22, low: 253.10, close: 257.44 },
//     { time: "2019-11-18", open: 257.80, high: 262.10, low: 255.42, close: 260.55 },
//     { time: "2019-11-25", open: 260.40, high: 265.22, low: 258.10, close: 263.88 },

//     { time: "2019-12-02", open: 263.20, high: 268.55, low: 261.22, close: 266.55 },
//     { time: "2019-12-09", open: 266.80, high: 271.10, low: 264.42, close: 269.77 },
//     { time: "2019-12-16", open: 270.40, high: 275.22, low: 268.10, close: 273.55 },
//     { time: "2019-12-23", open: 273.90, high: 278.42, low: 271.22, close: 276.88 },
//     { time: "2019-12-30", open: 277.20, high: 281.55, low: 275.10, close: 280.44 },
// ];

// const monthData = [
//     // ---- 2019 ----
//     { time: "2019-01-01", open: 172.55, high: 185.42, low: 170.22, close: 180.88 },
//     { time: "2019-02-01", open: 181.20, high: 190.55, low: 178.66, close: 188.42 },
//     { time: "2019-03-01", open: 188.55, high: 197.88, low: 186.22, close: 195.66 },
//     { time: "2019-04-01", open: 196.10, high: 203.42, low: 193.12, close: 201.99 },
//     { time: "2019-05-01", open: 202.10, high: 210.77, low: 200.05, close: 208.18 },
//     { time: "2019-06-01", open: 208.25, high: 215.10, low: 205.42, close: 212.77 },
//     { time: "2019-07-01", open: 213.00, high: 220.42, low: 210.55, close: 218.66 },
//     { time: "2019-08-01", open: 219.10, high: 225.77, low: 216.22, close: 223.44 },
//     { time: "2019-09-01", open: 223.55, high: 231.20, low: 221.42, close: 229.10 },
//     { time: "2019-10-01", open: 229.80, high: 237.22, low: 227.05, close: 234.77 },
//     { time: "2019-11-01", open: 235.10, high: 242.55, low: 232.88, close: 240.22 },
//     { time: "2019-12-01", open: 240.40, high: 248.10, low: 238.12, close: 246.66 },

//     // ---- 2020 ----
//     { time: "2020-01-01", open: 247.20, high: 255.55, low: 244.42, close: 252.77 },
//     { time: "2020-02-01", open: 252.90, high: 260.10, low: 250.11, close: 257.44 },
//     { time: "2020-03-01", open: 257.70, high: 265.55, low: 255.22, close: 261.99 },
//     { time: "2020-04-01", open: 262.10, high: 270.77, low: 259.55, close: 268.18 },
//     { time: "2020-05-01", open: 268.20, high: 276.55, low: 265.22, close: 272.88 },
//     { time: "2020-06-01", open: 273.00, high: 281.42, low: 270.55, close: 278.66 },
//     { time: "2020-07-01", open: 279.10, high: 288.55, low: 276.22, close: 284.77 },
//     { time: "2020-08-01", open: 285.20, high: 293.88, low: 282.42, close: 290.33 },
//     { time: "2020-09-01", open: 291.00, high: 299.42, low: 288.22, close: 295.66 },
//     { time: "2020-10-01", open: 296.40, high: 305.10, low: 293.55, close: 301.77 },
//     { time: "2020-11-01", open: 302.10, high: 310.22, low: 299.55, close: 307.22 },
//     { time: "2020-12-01", open: 307.50, high: 316.10, low: 304.55, close: 312.99 },

//     // ---- 2021 ----
//     { time: "2021-01-01", open: 313.20, high: 321.88, low: 310.42, close: 318.55 },
//     { time: "2021-02-01", open: 318.90, high: 327.55, low: 316.22, close: 323.44 },
//     { time: "2021-03-01", open: 324.10, high: 332.42, low: 321.55, close: 329.22 },
//     { time: "2021-04-01", open: 330.20, high: 338.77, low: 327.55, close: 334.66 },
//     { time: "2021-05-01", open: 335.00, high: 343.55, low: 332.22, close: 340.44 },
//     { time: "2021-06-01", open: 341.20, high: 349.88, low: 338.42, close: 346.77 },
//     { time: "2021-07-01", open: 347.00, high: 356.22, low: 344.55, close: 352.88 },
//     { time: "2021-08-01", open: 353.40, high: 362.10, low: 350.22, close: 358.55 },
//     { time: "2021-09-01", open: 359.00, high: 367.55, low: 356.42, close: 364.22 },
//     { time: "2021-10-01", open: 365.20, high: 373.77, low: 362.55, close: 370.44 },
//     { time: "2021-11-01", open: 371.10, high: 379.55, low: 368.22, close: 376.77 },
//     { time: "2021-12-01", open: 377.50, high: 385.22, low: 374.55, close: 382.66 },

//     // ---- 2022 ----
//     { time: "2022-01-01", open: 383.20, high: 391.88, low: 380.55, close: 388.55 },
//     { time: "2022-02-01", open: 389.10, high: 397.55, low: 386.22, close: 393.44 },
//     { time: "2022-03-01", open: 394.50, high: 402.88, low: 391.55, close: 399.77 },
//     { time: "2022-04-01", open: 400.20, high: 408.55, low: 397.22, close: 404.88 },
//     { time: "2022-05-01", open: 405.10, high: 413.77, low: 402.22, close: 410.55 },
//     { time: "2022-06-01", open: 411.40, high: 419.22, low: 408.42, close: 416.10 },
//     { time: "2022-07-01", open: 417.00, high: 425.55, low: 414.22, close: 422.77 },
//     { time: "2022-08-01", open: 423.10, high: 431.88, low: 420.22, close: 428.66 },
//     { time: "2022-09-01", open: 429.40, high: 437.55, low: 426.42, close: 434.33 },
//     { time: "2022-10-01", open: 435.20, high: 443.77, low: 432.22, close: 440.66 },
//     { time: "2022-11-01", open: 441.00, high: 449.55, low: 438.42, close: 446.22 },
//     { time: "2022-12-01", open: 447.50, high: 455.88, low: 444.55, close: 452.99 },

//     // ---- 2023 ----
//     { time: "2023-01-01", open: 453.20, high: 461.55, low: 450.22, close: 458.10 },
//     { time: "2023-02-01", open: 459.10, high: 467.55, low: 456.22, close: 464.44 },
//     { time: "2023-03-01", open: 465.50, high: 473.88, low: 462.42, close: 470.77 },
//     { time: "2023-04-01", open: 471.20, high: 479.55, low: 468.22, close: 476.66 },
//     { time: "2023-05-01", open: 477.40, high: 485.77, low: 474.42, close: 482.55 },
//     { time: "2023-06-01", open: 483.10, high: 491.88, low: 480.22, close: 488.44 },
//     { time: "2023-07-01", open: 489.40, high: 497.55, low: 486.22, close: 494.77 },
//     { time: "2023-08-01", open: 495.20, high: 503.55, low: 492.22, close: 500.66 },
//     { time: "2023-09-01", open: 501.00, high: 509.77, low: 498.22, close: 506.22 },
//     { time: "2023-10-01", open: 507.50, high: 515.22, low: 504.42, close: 512.99 },
//     { time: "2023-11-01", open: 513.20, high: 521.55, low: 510.22, close: 518.44 },
//     { time: "2023-12-01", open: 519.40, high: 527.88, low: 516.22, close: 524.77 },
// ];

// const yearData = [
//     { time: "2010-01-01", open: 85.12, high: 98.55, low: 82.42, close: 92.77 },
//     { time: "2011-01-01", open: 93.20, high: 110.22, low: 90.18, close: 105.66 },
//     { time: "2012-01-01", open: 106.10, high: 120.45, low: 101.88, close: 115.33 },
//     { time: "2013-01-01", open: 116.25, high: 130.55, low: 113.42, close: 128.77 },
//     { time: "2014-01-01", open: 129.12, high: 140.22, low: 125.66, close: 135.44 },
//     { time: "2015-01-01", open: 120.22, high: 135.55, low: 118.42, close: 130.88 },
//     { time: "2016-01-01", open: 131.10, high: 145.42, low: 128.12, close: 140.22 },
//     { time: "2017-01-01", open: 141.50, high: 160.88, low: 139.25, close: 155.66 },
//     { time: "2018-01-01", open: 156.10, high: 178.55, low: 153.77, close: 170.44 },
//     { time: "2019-01-01", open: 171.50, high: 200.12, low: 168.42, close: 195.77 },
//     { time: "2020-01-01", open: 196.22, high: 225.88, low: 190.42, close: 210.55 },
//     { time: "2021-01-01", open: 211.40, high: 245.22, low: 205.12, close: 235.88 },
//     { time: "2022-01-01", open: 236.50, high: 260.10, low: 230.44, close: 248.22 },
//     { time: "2023-01-01", open: 249.77, high: 280.33, low: 243.12, close: 275.66 },
//     { time: "2024-01-01", open: 276.10, high: 310.55, low: 270.25, close: 302.44 },
//     { time: "2025-01-01", open: 303.33, high: 340.12, low: 298.42, close: 325.55 },
// ];


interface CandlestickChartProps {
    selectedStock: string;
    setSelectedStock: React.Dispatch<React.SetStateAction<string>>;
    colors?: {
        backgroundColor?: string;
        textColor?: string;
        upColor?: string;
        downColor?: string;
        borderUpColor?: string;
        borderDownColor?: string;
        wickUpColor?: string;
        wickDownColor?: string;
    };
}

const CandlestickChart = (props: CandlestickChartProps) => {
    const {
        selectedStock,
        setSelectedStock,
        colors: {
            backgroundColor = 'black',
            textColor = 'white',
            upColor = '#26a69a',
            downColor = '#ef5350',
            borderUpColor = '#26a69a',
            borderDownColor = '#ef5350',
            wickUpColor = '#26a69a',
            wickDownColor = '#ef5350',
        } = {},
    } = props;

    // const seriesesData = useMemo(
    //     () => new Map([['1D', dayData], ['1W', weekData], ['1M', monthData], ['1Y', yearData]]),
    //     []
    // );

    const [, setStocks] = useState<string[]>([]);
    const [, setLoading] = useState(false);
    // const [stockData, setStockData] = useState([]);
    // const [activeInterval, setActiveInterval] = useState('1D');
    // const [currentData, setCurrentData] = useState(seriesesData.get('1D'));
    // const [searchTerm, setSearchTerm] = useState("");
    const chartContainerRef = useRef<HTMLDivElement>(null);


    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    // useEffect(() => {
    //     const fetchStocks = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await fetch(`${baseURL}/stocks`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             setStocks(data);

    //             // Auto-select first stock if available
    //             if (data.length > 0) {
    //                 setSelectedStock(data[0]);
    //             }
    //         } catch (err) {
    //             console.error('Error fetching stocks:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchStocks();
    // }, []);

    useEffect(() => {
        setStocks(stocklist);
        if (stocklist.length > 0) {
            setSelectedStock(stocklist[0]);
        }
    }, []);

    useEffect(() => {
        if (!selectedStock || !seriesRef.current) return;

        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseURL}/stocks/${selectedStock}`);
                const data = await response.json();

                // Transform API response -> lightweight-charts format
                const formatted = data
                    .map((d: any) => {
                        const date = new Date(d.date);
                        return {
                            time: {
                                year: date.getUTCFullYear(),
                                month: date.getUTCMonth() + 1,
                                day: date.getUTCDate(),
                            },
                            open: d.open_price,
                            high: d.high_price,
                            low: d.low_price,
                            close: d.close_price,
                        };
                    })
                    .sort(
                        (
                            a: { time: { year: number; month: number; day: number } },
                            b: { time: { year: number; month: number; day: number } }
                        ) =>
                            a.time.year - b.time.year ||
                            a.time.month - b.time.month ||
                            a.time.day - b.time.day
                    );


                seriesRef.current?.setData(formatted);
            } catch (err) {
                console.error("Error fetching stock data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [selectedStock]);

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: { color: 'black' },
                horzLines: { color: 'black' },
            },
            crosshair: {
                mode: 1,
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 0.8)',
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.8)',
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: colors.green,
            downColor: colors.red,
            borderUpColor: colors.green,
            borderDownColor: colors.red,
            wickUpColor: colors.green,
            wickDownColor: colors.red,
        });

        chart.timeScale().fitContent();

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [backgroundColor, textColor, upColor, downColor, borderUpColor, borderDownColor, wickUpColor, wickDownColor]);

    // Update data when interval changes
    // useEffect(() => {
    //     if (seriesRef.current) {
    //         seriesRef.current.setData(currentData ?? []);
    //         if (chartRef.current) {
    //             chartRef.current.timeScale().fitContent();
    //         }
    //     }
    // }, [currentData]);

    // const handleIntervalChange = (interval: string) => {
    //     setActiveInterval(interval);
    //     setCurrentData(seriesesData.get(interval));
    // };

    return (

        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                display: 'flex',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
                {['1D', '1W', '1M', '1Y'].map((interval) => (
                    <Button
                        key={interval}
                        onClick={() => handleIntervalChange(interval)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            backgroundColor: activeInterval === interval
                                ? '#333'
                                : 'transparent',
                            color: activeInterval === interval ? 'white' : '#333',
                        }}
                    >
                        {interval}
                    </Button>
                ))}
            </div> */}

            <div className="w-64 absolute right-20 top-10 z-10">
                <StockSearchDropdown selectedStock={selectedStock} setSelectedStock={setSelectedStock} />
            </div>

            {/* Chart Container */}
            <div
                ref={chartContainerRef}
                className='w-[100%] h-[100%]'
            />
        </div>

    );
};

export default CandlestickChart;