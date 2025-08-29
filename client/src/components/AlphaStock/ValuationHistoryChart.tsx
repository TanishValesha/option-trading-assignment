// src/components/ValuationHistoryCard.tsx

import React from 'react';
import { RotateCcw, Play, InfoIcon, type LucideIcon } from 'lucide-react'; // Import LucideIcon for type safety
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

// --- Type Definitions (within the same file as requested) ---

// Interface for each data point in the chart
interface ChartDataPoint {
    date: string;
    price: number;
    intrinsicValue: number;
    timestamp: string; // Used for date sorting/filtering
}

// Interface for the payload array in Recharts Tooltip
interface RechartsTooltipPayload {
    name: string;
    value: number;
    color?: string;
    dataKey: string;
    // Recharts payload often includes the original data object for the point
    payload: ChartDataPoint; // More specific type if you need to access other properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow for other unknown properties that Recharts might add
}

// Props for the CustomTooltip component
interface CustomTooltipProps {
    active?: boolean;
    payload?: RechartsTooltipPayload[];
    label?: string;
}

// Props for the StatsBadge component
interface StatsBadgeProps {
    icon?: LucideIcon; // icon prop can accept any Lucide icon component
    label: string;
    value: string | number;
    // Assuming your Badge component has these specific variants
    variant?: "secondary" | "destructive" | "default" | null | undefined;
    className?: string;
}

// --- Sample Data ---
const chartData: ChartDataPoint[] = [
    { date: 'Sep 20', price: 24.5, intrinsicValue: 52.1, timestamp: '2020-09-01' },
    { date: 'Nov 20', price: 26.8, intrinsicValue: 53.2, timestamp: '2020-11-01' },
    { date: 'Jan 21', price: 32.1, intrinsicValue: 54.8, timestamp: '2021-01-01' },
    { date: 'Mar 21', price: 38.9, intrinsicValue: 56.2, timestamp: '2021-03-01' },
    { date: 'May 21', price: 42.3, intrinsicValue: 57.1, timestamp: '2021-05-01' },
    { date: 'Jul 21', price: 39.8, intrinsicValue: 56.8, timestamp: '2021-07-01' },
    { date: 'Sep 21', price: 41.2, intrinsicValue: 55.9, timestamp: '2021-09-01' },
    { date: 'Nov 21', price: 45.6, intrinsicValue: 54.2, timestamp: '2021-11-01' },
    { date: 'Jan 22', price: 44.1, intrinsicValue: 53.8, timestamp: '2022-01-01' },
    { date: 'Mar 22', price: 41.8, intrinsicValue: 52.9, timestamp: '2022-03-01' },
    { date: 'May 22', price: 36.2, intrinsicValue: 51.8, timestamp: '2022-05-01' },
    { date: 'Jul 22', price: 33.1, intrinsicValue: 50.9, timestamp: '2022-07-01' },
    { date: 'Sep 22', price: 30.8, intrinsicValue: 49.8, timestamp: '2022-09-01' },
    { date: 'Nov 22', price: 35.4, intrinsicValue: 50.2, timestamp: '2022-11-01' },
    { date: 'Jan 23', price: 33.7, intrinsicValue: 51.1, timestamp: '2023-01-01' },
    { date: 'Mar 23', price: 28.2, intrinsicValue: 52.3, timestamp: '2023-03-01' },
    { date: 'May 23', price: 29.1, intrinsicValue: 53.8, timestamp: '2023-05-01' },
    { date: 'Jul 23', price: 28.6949, intrinsicValue: 55.259, timestamp: '2023-07-01' }, // Current target date/price
    { date: 'Sep 23', price: 27.8, intrinsicValue: 56.1, timestamp: '2023-09-01' },
    { date: 'Nov 23', price: 29.2, intrinsicValue: 56.8, timestamp: '2023-11-01' },
    { date: 'Jan 24', price: 33.4, intrinsicValue: 57.2, timestamp: '2024-01-01' },
    { date: 'Mar 24', price: 38.1, intrinsicValue: 57.8, timestamp: '2024-03-01' },
    { date: 'May 24', price: 39.7, intrinsicValue: 58.1, timestamp: '2024-05-01' },
    { date: 'Jul 24', price: 41.3, intrinsicValue: 58.4, timestamp: '2024-07-01' },
    { date: 'Sep 24', price: 43.8, intrinsicValue: 58.9, timestamp: '2024-09-01' },
    { date: 'Nov 24', price: 46.2, intrinsicValue: 59.2, timestamp: '2024-11-01' },
    { date: 'Jan 25', price: 48.8, intrinsicValue: 59.6, timestamp: '2025-01-01' },
    { date: 'May 25', price: 47.9, intrinsicValue: 59.8, timestamp: '2025-05-01' }
];

// Custom tooltip component
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Ensure payload entries are of type RechartsTooltipPayload
        const typedPayload: RechartsTooltipPayload[] = payload;

        const priceEntry = typedPayload.find(p => p.dataKey === 'price');
        const intrinsicEntry = typedPayload.find(p => p.dataKey === 'intrinsicValue');

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
                {priceEntry && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priceEntry.color || '#10b981' }} />
                        <span className="text-sm text-gray-600">
                            {priceEntry.name}: <span className="font-semibold">${priceEntry.value.toFixed(2)}</span>
                        </span>
                    </div>
                )}
                {intrinsicEntry && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: intrinsicEntry.color || '#64748b' }} />
                        <span className="text-sm text-gray-600">
                            {intrinsicEntry.name}: <span className="font-semibold">${intrinsicEntry.value.toFixed(2)}</span>
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

// Stats Badge Component
const StatsBadge: React.FC<StatsBadgeProps> = ({ icon: Icon, label, value, variant = "secondary", className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Render LucideIcon component if provided */}
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            <span className="text-sm text-gray-600">{label}</span>
            <Badge variant={variant} className={`
                ${variant === 'destructive' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                ${variant === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' : ''}
                ${variant === 'default' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
            `}>
                {value}
            </Badge>
        </div>
    );
};

// Main Valuation History Component
const ValuationHistoryCard: React.FC = () => {
    // These should ideally come from your actual data or calculated dynamically
    // For now, based on the 'Jul 23' data point in chartData
    const currentPrice = 28.6949;
    const intrinsicValue = 55.259;
    const undervaluationPercent = Math.round(((intrinsicValue - currentPrice) / intrinsicValue) * 100);

    // Filter chart data to exclude future dates if desired based on current date
    // Current date is August 1, 2025. The image shows a reference line at "Nov 21, 2023".
    // Let's use that specific date for filtering and the reference line.
    const todayReferenceDate = new Date('2023-11-21T00:00:00Z'); // Using UTC to avoid timezone issues for comparison

    const filteredChartData = chartData.filter(d => new Date(d.timestamp) <= todayReferenceDate);

    // Find the closest data point's 'date' value for the ReferenceLine's `x` prop
    // The image's ReferenceLine is on 'Nov 23'.
    const referenceLineXAxisValue = chartData.find(d => d.timestamp === '2023-11-01')?.date || 'Nov 23';
    const referenceLineDateLabel = todayReferenceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Determine Y-axis domain
    const allPrices = [
        ...filteredChartData.map(d => d.price),
        ...filteredChartData.map(d => d.intrinsicValue),
        currentPrice, // Ensure current price is within domain
        intrinsicValue // Ensure intrinsic value is within domain
    ].filter((p): p is number => typeof p === 'number'); // Filter out any non-numbers

    const minY = Math.min(...allPrices);
    const maxY = Math.max(...allPrices);
    const domainPadding = (maxY - minY) * 0.1; // 10% padding for visual space

    return (
        <Card className="w-full bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <RotateCcw className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Valuation History</h2>
                            <p className="text-sm text-gray-500">Bank of America Corp</p>
                        </div>
                    </div>
                    {/* Placeholder for the red square with graph icon */}
                    <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z" />
                        </svg>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Alert Message */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                    <div className="flex items-start">
                        <div className="w-3 h-3 bg-red-600 rounded-sm mt-1 mr-2 flex-shrink-0"></div>
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">BAC</span> is now{' '}
                                <span className="font-semibold text-red-600">more expensive</span>{' '}
                                than it has been at any time in the past 5 years.{' '}
                                <Button variant="link" className="text-blue-600 underline p-0 h-auto text-sm">
                                    What does this mean?
                                </Button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsBadge
                        icon={InfoIcon}
                        label="History Conclusion"
                        value="Unattractive"
                        variant="destructive"
                    />
                    <StatsBadge
                        icon={InfoIcon}
                        label="Current Valuation"
                        value={`${undervaluationPercent}% undervalued`}
                    />
                    <StatsBadge
                        icon={InfoIcon}
                        label="5-Year Average"
                        value="38% undervaluation"
                    />
                    <StatsBadge
                        icon={InfoIcon}
                        label="Average Value Growth"
                        value="1%"
                        variant="default"
                    />
                </div>

                {/* Chart Container */}
                <div className="relative h-96 w-full bg-gradient-to-b from-gray-50 to-white rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={filteredChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#666' }}
                                interval="preserveStartEnd"
                            // Optional: Custom formatter for fewer ticks if `interval="preserveStartEnd"` isn't enough
                            // tickFormatter={(value: string, index: number) => {
                            //     const totalTicks = filteredChartData.length;
                            //     const idealTicks = 8; // Adjust as needed
                            //     if (totalTicks <= idealTicks || index % Math.ceil(totalTicks / idealTicks) === 0) {
                            //         return value;
                            //     }
                            //     return '';
                            // }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#666' }}
                                orientation="right"
                                domain={[minY - domainPadding, maxY + domainPadding]}
                            />
                            {/* Pass content prop to Tooltip for custom rendering */}
                            <Tooltip content={<CustomTooltip />} />

                            {/* Intrinsic Value Line */}
                            <Line
                                type="monotone"
                                dataKey="intrinsicValue"
                                stroke="#64748b" /* Slate/gray color */
                                strokeWidth={2}
                                strokeDasharray="8 4" /* Dashed pattern */
                                dot={false}
                                name="Intrinsic Value"
                            />

                            {/* Price Line with Gradient Fill (if applicable, image shows solid line with area fill) */}
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981" /* Emerald/green color */
                                strokeWidth={3}
                                dot={false}
                                name="Price"
                            // The original image *doesn't* show a gradient fill under the line,
                            // but rather a solid line with a potentially light background shading.
                            // If you want an area fill like the original, it's a separate component.
                            // fill="url(#priceGradient)" // Uncomment if you want an area fill
                            />

                            {/* Current Date Reference Line */}
                            <ReferenceLine
                                x={referenceLineXAxisValue} // Use the specific date string from data
                                stroke="#94a3b8" /* Grayish stroke */
                                strokeDasharray="2 2"
                                label={{
                                    value: referenceLineDateLabel, // "Nov 21, 2023"
                                    position: "bottom", // Position below the X-axis
                                    offset: 15, // Offset from the axis
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '12px',
                                        fill: '#64748b',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />

                            {/* Gradient definition for Line fill (if you choose to add area fill) */}
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Floating Value Labels - Positioned Absolutely with Tailwind CSS */}
                    {/* These will need manual tuning or a more advanced Recharts Customization to align perfectly */}
                    {/* Intrinsic Value Label */}
                    <div
                        className="absolute bg-slate-700 text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap z-10"
                        style={{
                            // These values are estimated and will likely need fine-tuning for your specific chart dimensions
                            right: '30px', // Right margin from the chart area
                            top: `${(1 - (intrinsicValue - minY) / (maxY - minY)) * (100 - (20 + 60) / 4) + 20}%`, // Crude estimate: (1-normalized_y) * (chart_area_percentage) + top_margin_percentage
                            transform: 'translateY(-50%)' // Center vertically
                        }}
                    >
                        INTRINSIC VALUE {intrinsicValue.toFixed(3)}
                    </div>

                    {/* Price Label */}
                    <div
                        className="absolute bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap z-10"
                        style={{
                            right: '30px',
                            top: `${(1 - (currentPrice - minY) / (maxY - minY)) * (100 - (20 + 60) / 4) + 20 + 35}%`, // Crude estimate: add offset for price label below intrinsic
                            transform: 'translateY(-50%)' // Center vertically
                        }}
                    >
                        PRICE {currentPrice.toFixed(4)}
                    </div>
                    {/* "22% UNDERVALUED" Badge for Price Label */}
                    <div
                        className="absolute bg-emerald-700 text-white px-2 py-1 rounded-b text-xs flex items-center gap-1 z-10"
                        style={{
                            right: '30px',
                            top: `${(1 - (currentPrice - minY) / (maxY - minY)) * (100 - (20 + 60) / 4) + 20 + 35 + 20}%`, // Position below the main price label
                            transform: 'translateY(-50%)',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0
                        }}
                    >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        {undervaluationPercent}% UNDERVALUED
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="flex items-center gap-2 pt-4 border-t">
                    <Play className="w-4 h-4 text-red-600" />
                    <Button variant="link" className="text-gray-600 underline p-0 h-auto text-sm">
                        What is Valuation History?
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ValuationHistoryCard;