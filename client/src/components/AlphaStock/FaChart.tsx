import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface DataPoint {
    period: string;
    eps: number;
    price: number;
    fullDate: string;
    change?: number;
    shortLabel: string;
}

const BankOfAmericaChart: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('5Y');
    const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

    // Complete dataset matching the original chart
    const allData: DataPoint[] = [
        { period: 'Sept 20', eps: 2.05, price: 24.2, fullDate: 'September 2020', change: -5.2, shortLabel: 'Sep 20' },
        { period: 'Jan 21', eps: 1.87, price: 32.8, fullDate: 'January 2021', change: 35.5, shortLabel: 'Jan 21' },
        { period: 'May 21', eps: 2.31, price: 42.1, fullDate: 'May 2021', change: 28.4, shortLabel: 'May 21' },
        { period: 'Sept 21', eps: 2.99, price: 40.8, fullDate: 'September 2021', change: -3.1, shortLabel: 'Sep 21' },
        { period: 'Jan 22', eps: 3.41, price: 45.6, fullDate: 'January 2022', change: 11.8, shortLabel: 'Jan 22' },
        { period: 'May 22', eps: 3.57, price: 36.2, fullDate: 'May 2022', change: -20.6, shortLabel: 'May 22' },
        { period: 'Sept 22', eps: 3.6, price: 32.4, fullDate: 'September 2022', change: -10.5, shortLabel: 'Sep 22' },
        { period: 'Jan 23', eps: 3.25, price: 33.8, fullDate: 'January 2023', change: 4.3, shortLabel: 'Jan 23' },
        { period: 'May 23', eps: 3.16, price: 28.9, fullDate: 'May 2023', change: -14.5, shortLabel: 'May 23' },
        { period: 'Sept 23', eps: 3.19, price: 27.8, fullDate: 'September 2023', change: -3.8, shortLabel: 'Sep 23' },
        { period: 'Jan 24', eps: 3.3, price: 33.4, fullDate: 'January 2024', change: 20.1, shortLabel: 'Jan 24' },
        { period: 'May 24', eps: 3.48, price: 38.7, fullDate: 'May 2024', change: 15.9, shortLabel: 'May 24' },
        { period: 'Sept 24', eps: 3.57, price: 40.2, fullDate: 'September 2024', change: 3.9, shortLabel: 'Sep 24' },
        { period: 'Jan 25', eps: 3.08, price: 43.1, fullDate: 'January 2025', change: 7.2, shortLabel: 'Jan 25' },
        { period: 'May 25', eps: 2.89, price: 46.8, fullDate: 'May 2025', change: 8.6, shortLabel: 'May 25' },
        { period: 'Sept 25', eps: 2.86, price: 45.2, fullDate: 'September 2025', change: -3.4, shortLabel: 'Sep 25' },
        { period: 'Jan 26', eps: 2.77, price: 48.1, fullDate: 'January 2026', change: 6.4, shortLabel: 'Jan 26' },
        { period: 'May 26', eps: 3.21, price: 49.3, fullDate: 'May 2026', change: 2.5, shortLabel: 'May 26' },
        { period: 'Sept 26', eps: 3.39, price: 47.8, fullDate: 'September 2026', change: -3.0, shortLabel: 'Sep 26' },
        { period: 'Jan 27', eps: 3.47, price: 50.2, fullDate: 'January 2027', change: 5.0, shortLabel: 'Jan 27' }
    ];

    const getFilteredData = (period: string): DataPoint[] => {
        switch (period) {
            case '1M':
                return allData.slice(-1);
            case '6M':
                return allData.slice(-2);
            case '1Y':
                return allData.slice(-4);
            case '3Y':
                return allData.slice(-12);
            case '5Y':
                return allData.slice(-16);
            case '10Y':
                return allData.slice(-18);
            case 'All':
            default:
                return allData;
        }
    };

    const filteredData = getFilteredData(selectedPeriod);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-xl z-50">
                    <p className="font-bold text-gray-900 text-sm">{data.fullDate}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
                        <span className="text-xs text-gray-700">EPS: ${data.eps.toFixed(2)}</span>
                        {/* Hover Information Display */}
                        {hoveredData && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Selected: {hoveredData.fullDate}</h4>
                                        <div className="flex gap-6 mt-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                                                <span className="text-gray-700">EPS: <span className="font-semibold">${hoveredData.eps.toFixed(2)}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-1 bg-blue-500 rounded"></div>
                                                <span className="text-gray-700">Price: <span className="font-semibold">${hoveredData.price.toFixed(2)}</span></span>
                                            </div>
                                            {hoveredData.change && (
                                                <div>
                                                    <span className="text-gray-700">Change: </span>
                                                    <span className={`font-semibold ${hoveredData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {hoveredData.change >= 0 ? '+' : ''}{hoveredData.change.toFixed(1)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-blue-500 rounded"></div>
                        <span className="text-xs text-gray-700">Price: ${data.price.toFixed(2)}</span>
                    </div>
                    {data.change && (
                        <p className={`text-xs mt-1 ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBarHover = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setHoveredData(data.activePayload[0].payload);
        }
    };

    const handleChartLeave = () => {
        setHoveredData(null);
    };

    const timeButtons = [
        { label: '1M', value: '1M', perf: '-3%', isNegative: true },
        { label: '6M', value: '6M', perf: '+2%', isNegative: false },
        { label: '1Y', value: '1Y', perf: '+27%', isNegative: false },
        { label: '3Y', value: '3Y', perf: '+53%', isNegative: false },
        { label: '5Y', value: '5Y', perf: '+111%', isNegative: false },
        { label: '10Y', value: '10Y', perf: '+226%', isNegative: false },
        { label: 'All', value: 'All', perf: '', isNegative: false }
    ];

    return (
        <div className="w-full bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">2. FUNDAMENTAL ANALYSIS</h2>

                {/* Company Info and Metrics */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-lg">📊</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Bank of America Corp</h3>
                            <p className="text-sm text-gray-600">NYSE:BAC</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg min-w-[120px]">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-600 font-medium">PRICE</span>
                                <div className="flex gap-1">
                                    <button className="text-gray-400 hover:text-gray-600">←</button>
                                    <button className="text-gray-400 hover:text-gray-600">→</button>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">$32.852</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg min-w-[120px]">
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-600 font-medium">EPS</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">$3.25</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 text-xs text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                        🇺🇸 <span>US</span>
                    </span>
                    <span className="flex items-center gap-1">
                        🏦 <span>Banking</span>
                    </span>
                    <span className="flex items-center gap-1">
                        💰 <span>Market Cap</span> <span className="font-medium">351.5B USD</span>
                    </span>
                    <span className="flex items-center gap-1">
                        📅 <span>IPO</span> <span className="font-medium">Jun 5, 1979</span>
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-80 mb-6 relative">
                    {/* Highlighted point indicator */}
                    {hoveredData && selectedPeriod === '5Y' && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-xs z-10">
                            Sep 9, 2022
                        </div>
                    )}

                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={filteredData}
                            margin={{ top: 40, right: 60, left: 20, bottom: 60 }}
                            onMouseMove={handleBarHover}
                            onMouseLeave={handleChartLeave}
                        >
                            <XAxis
                                dataKey="shortLabel"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                interval={0}
                                angle={0}
                            />
                            <YAxis
                                yAxisId="eps"
                                orientation="left"
                                domain={[0, 4]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                tickFormatter={(value) => value.toFixed(1)}
                            />
                            <YAxis
                                yAxisId="price"
                                orientation="right"
                                domain={[15, 55]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                tickFormatter={(value) => value.toFixed(0)}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Bar
                                yAxisId="eps"
                                dataKey="eps"
                                fill="#9CA3AF"
                                stroke="#6B7280"
                                strokeWidth={0.5}
                                radius={[1, 1, 0, 0]}
                                opacity={0.8}
                            >
                                {filteredData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.period === 'Sept 22' ? '#4B5563' : '#9CA3AF'}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Bar>

                            <Line
                                yAxisId="price"
                                type="monotone"
                                dataKey="price"
                                stroke="#60A5FA"
                                strokeWidth={2.5}
                                dot={{ r: 2, fill: '#60A5FA', strokeWidth: 0 }}
                                activeDot={{
                                    r: 5,
                                    fill: '#3B82F6',
                                    stroke: '#ffffff',
                                    strokeWidth: 2
                                }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Time Period Buttons */}
                <div className="flex items-center justify-center gap-1 mb-4">
                    {timeButtons.map((button,) => (
                        <button
                            key={button.value}
                            onClick={() => setSelectedPeriod(button.value)}
                            className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 ${selectedPeriod === button.value
                                ? 'bg-gray-800 text-white rounded'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded'
                                }`}
                        >
                            <span>{button.label}</span>
                            {button.perf && (
                                <span className={`ml-1 ${selectedPeriod === button.value
                                    ? 'text-white'
                                    : button.isNegative ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                    {button.perf}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="ml-4 border-l border-gray-300 pl-4">
                        <button className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center gap-1">
                            ⚖️ Compare to S&P 500
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional company metadata */}
            <div className="mt-4 text-center">
                <div className="inline-flex gap-6 text-xs text-gray-500">
                    <span>Banking Sector</span>
                    <span>•</span>
                    <span>Financial Services</span>
                    <span>•</span>
                    <span>Large Cap</span>
                    <span>•</span>
                    <span>Dividend Yield: 2.8%</span>
                </div>
            </div>
        </div>
    );
};

export default BankOfAmericaChart;