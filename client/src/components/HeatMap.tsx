import { useState, useMemo, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import {
    subDays,
    format,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    isWithinInterval,
    startOfWeek,
    endOfWeek,
    startOfYear,
    endOfYear,
    addDays,
} from 'date-fns';
import 'react-calendar-heatmap/dist/styles.css';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { baseURL } from '@/lib/baseURL';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';


const staticDemoHeatmapData: { date: string, count: number }[] = [];

interface HeatmapValue {
    date: string;
    count: number;
}

export function UserActivityHeatmap() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const DROPDOWN_START_YEAR = 2020;
    // const [savedPositions, setSavedPositions] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapValue[]>(staticDemoHeatmapData);
    const [selectedYear, setSelectedYear] = useState<number>(2021);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; visible: boolean }>({
        x: 0,
        y: 0,
        content: '',
        visible: false
    });

    const authToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }

    const startDateForHeatmap = useMemo(() => {
        if (selectedYear === currentYear) {
            return subDays(today, 365);
        }
        return startOfYear(new Date(selectedYear, 0, 1));
    }, [selectedYear, today, currentYear]);

    const endDateForHeatmap = useMemo(() => {
        if (selectedYear === currentYear) {
            return today;
        }
        return endOfYear(new Date(selectedYear, 0, 1));
    }, [selectedYear, today, currentYear]);

    const monthsToDisplay = useMemo(() => {
        return eachMonthOfInterval({
            start: startOfMonth(startDateForHeatmap),
            end: endOfMonth(endDateForHeatmap),
        });
    }, [startDateForHeatmap, endDateForHeatmap]);

    const relevantData = useMemo(() => {
        const filteredData = heatmapData.filter(item => {
            const itemDate = new Date(item.date);
            return isWithinInterval(itemDate, { start: startDateForHeatmap, end: endDateForHeatmap });
        });


        const dateRange: HeatmapValue[] = [];
        let currentDate = new Date(startDateForHeatmap);

        while (currentDate <= endDateForHeatmap) {
            const dateString = format(currentDate, 'yyyy-MM-dd');
            const existingData = filteredData.find(item => item.date === dateString);

            dateRange.push({
                date: dateString,
                count: existingData?.count || 0
            });

            currentDate = addDays(currentDate, 1);
        }

        return dateRange;
    }, [startDateForHeatmap, endDateForHeatmap]);

    const availableYears = useMemo(() => {
        const years: number[] = [];
        for (let year = DROPDOWN_START_YEAR; year <= currentYear; year++) {
            years.push(year);
        }
        return years.reverse();
    }, [currentYear]);

    useEffect(() => {
        const getPositions = async () => {
            console.log("Fetching positions...");
            try {
                const token = await authToken();
                if (!token) {
                    console.warn('Authentication token not available. Cannot fetch positions.');
                    return;
                }

                const response = await fetch(`${baseURL}/positions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched raw positions data:', data.positions);


                const aggregatedPnlByDate = new Map<string, number>();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (data.positions || []).forEach((pos: any) => {
                    const dateString = pos.end_date;
                    const pnl = parseFloat(pos.pnlAbs);
                    if (!isNaN(pnl)) {
                        aggregatedPnlByDate.set(dateString, (aggregatedPnlByDate.get(dateString) || 0) + pnl);
                    }
                });

                const newHeatmapData: HeatmapValue[] = Array.from(aggregatedPnlByDate.entries()).map(([date, count]) => ({
                    date,
                    count
                }));


                setHeatmapData(newHeatmapData);
                console.log('Aggregated heatmapData set to state:', newHeatmapData);

            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        }

        getPositions();
    }, []);

    const handleMouseEnter = (event: React.MouseEvent, value: HeatmapValue | null) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();

        if (!value || !value.date) {
            setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                content: 'No date information',
                visible: true
            });
            return;
        }

        const date = new Date(value.date);
        const dayName = format(date, 'EEEE');
        const formattedDate = format(date, 'MMMM d, yyyy');
        let activityText = '';
        if (value.count > 0) {
            activityText = `+${value.count}`;
        } else if (value.count < 0) {
            activityText = `${value.count}`;
        }

        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            content: `${dayName}, ${formattedDate} ${activityText}`,
            visible: true
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };


    const legendColors = useMemo(() => {
        if (isDark) {
            return [
                'bg-gray-800',      // No activity
                'bg-green-700',     // Light positive
                'bg-green-600',     // Medium positive
                'bg-green-500',     // High positive
                'bg-green-400'      // Very high positive
            ];
        } else {
            return [
                'bg-gray-200',      // No activity
                'bg-green-200',     // Light positive
                'bg-green-400',     // Medium positive
                'bg-green-600',     // High positive
                'bg-green-800'      // Very high positive
            ];
        }
    }, [isDark]);

    return (
        <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 w-screen min-h-screen rounded-lg shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'} ${isDark ? 'text-white' : 'text-gray-900'} overflow-x-auto relative`}>
            <div className="flex flex-col min-h-screen justify-center items-center space-x-4">
                <div className="flex justify-baseline items-center mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={`flex items-center gap-1 ${isDark ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
                                {selectedYear === currentYear
                                    ? `Last 365 Days (ending ${format(today, 'MMM d, yyyy')})`
                                    : `${selectedYear}`
                                }
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`w-56 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                            <DropdownMenuLabel>Select Year</DropdownMenuLabel>
                            {availableYears.map((year) => (
                                <DropdownMenuItem
                                    key={year}
                                    onSelect={() => setSelectedYear(year)}
                                    className={`cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    {year === currentYear
                                        ? `Last 365 Days (ending ${format(today, 'MMM d, yyyy')})`
                                        : `${year}`
                                    }
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='flex space-x-4'>
                    {monthsToDisplay.map((monthStart) => {
                        const monthEndDate = endOfMonth(monthStart);
                        const monthStartDate = startOfMonth(monthStart);

                        const monthData = relevantData.filter(item => {
                            const itemDate = new Date(item.date);
                            return isWithinInterval(itemDate, { start: monthStartDate, end: monthEndDate });
                        });


                        const heatmapRenderStartDate = startOfWeek(monthStartDate, { weekStartsOn: 0 }); // Sunday is 0


                        const heatmapRenderEndDate = endOfWeek(monthEndDate, { weekStartsOn: 0 });


                        const extendedMonthData = [];
                        let currentDate = new Date(heatmapRenderStartDate);

                        while (currentDate <= heatmapRenderEndDate) {
                            const dateString = format(currentDate, 'yyyy-MM-dd');
                            const isInCurrentMonth = isWithinInterval(currentDate, { start: monthStartDate, end: monthEndDate });

                            if (isInCurrentMonth) {

                                const existingData = monthData.find(item => item.date === dateString);
                                extendedMonthData.push({
                                    date: dateString,
                                    count: existingData?.count || 0
                                });
                            } else {

                                extendedMonthData.push({
                                    date: dateString,
                                    count: -1
                                });
                            }

                            currentDate = addDays(currentDate, 1);
                        }

                        return (
                            <div key={format(monthStart, 'yyyy-MM')} className="flex-shrink-0 w-24">
                                <h3 className={`text-md font-medium text-center mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {format(monthStart, 'MMMMMM')}
                                </h3>
                                <CalendarHeatmap
                                    startDate={heatmapRenderStartDate}
                                    endDate={heatmapRenderEndDate}
                                    values={extendedMonthData}
                                    classForValue={(value) => {

                                        if (!value || (value as HeatmapValue).count === -1) {
                                            return 'fill-transparent';
                                        }
                                        const v = value as HeatmapValue;


                                        if (v.count === 0) {
                                            return isDark ? 'fill-gray-800' : 'fill-gray-200';
                                        }


                                        if (v.count > 0) {
                                            if (v.count > 0 && v.count < 100) {

                                                return isDark ? 'fill-green-700' : 'fill-green-200';
                                            }
                                            if (v.count >= 100 && v.count < 500) {

                                                return isDark ? 'fill-green-600' : 'fill-green-400';
                                            }

                                            return isDark ? 'fill-green-500' : 'fill-green-600';
                                        }


                                        if (v.count < 0) {
                                            if (v.count > -100) {

                                                return isDark ? 'fill-red-700' : 'fill-red-200';
                                            }
                                            if (v.count <= -100 && v.count > -500) {

                                                return isDark ? 'fill-red-600' : 'fill-red-400';
                                            }

                                            return isDark ? 'fill-red-500' : 'fill-red-600';
                                        }


                                        return isDark ? 'fill-gray-800' : 'fill-gray-200';
                                    }}
                                    onClick={(value) => {
                                        const v = value as HeatmapValue | undefined;
                                        if (v && v.date && v.count !== -1) {
                                            console.log(`Clicked on ${v.date} with ${v.count} activities`);
                                        }
                                    }}
                                    onMouseOver={(event, value) => {
                                        const v = value as HeatmapValue | undefined;
                                        if (v && v.count !== -1) {
                                            handleMouseEnter(event as React.MouseEvent, v);
                                        }
                                    }}
                                    onMouseLeave={handleMouseLeave}
                                    showWeekdayLabels={false}
                                    showMonthLabels={false}
                                    gutterSize={1}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`flex justify-end mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2">Less</span>
                <div className="flex space-x-1">
                    {legendColors.map((color, index) => (
                        <span key={index} className={`w-4 h-4 rounded-sm ${color}`}></span>
                    ))}
                </div>
                <span className="ml-2">More</span>
            </div>

            {/* Custom Tooltip */}
            {tooltip.visible && (
                <div
                    className={`fixed z-50 px-2 py-1 text-xs ${isDark ? 'text-white bg-gray-900 border-gray-700' : 'text-gray-900 bg-white border-gray-300'} border rounded shadow-lg pointer-events-none whitespace-nowrap`}
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translateX(-50%) translateY(-100%)',
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
}