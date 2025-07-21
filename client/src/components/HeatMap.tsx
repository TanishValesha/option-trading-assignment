// components/ui/UserActivityHeatmap.tsx
'use client';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import {
    addDays,
    subDays,
    format,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    isWithinInterval,
    // These two are important to align each month's heatmap to start on a Sunday
    // or the first day of the week, which CalendarHeatmap expects
    startOfWeek,
    endOfWeek,
} from 'date-fns';
import 'react-calendar-heatmap/dist/styles.css'; // Keep default styles for structure

// --- DEMO DATA (same as provided previously) ---
const staticDemoHeatmapData = [
    // Example data for late July 2024 (start of the year-long period)
    { date: "2024-07-22", count: 0 },
    { date: "2024-07-23", count: 1 },
    { date: "2024-07-24", count: 3 },
    { date: "2024-07-25", count: 7 },
    { date: "2024-07-26", count: 12 },
    { date: "2024-07-27", count: 2 },
    { date: "2024-07-28", count: 0 },

    // August 2024
    { date: "2024-08-01", count: 5 },
    { date: "2024-08-02", count: 10 },
    { date: "2024-08-03", count: 1 },
    { date: "2024-08-04", count: 0 },
    { date: "2024-08-05", count: 8 },
    { date: "2024-08-15", count: 15 }, // Example high day
    { date: "2024-08-20", count: 6 },

    // September 2024
    { date: "2024-09-01", count: 0 },
    { date: "2024-09-05", count: 9 },
    { date: "2024-09-10", count: 4 },
    { date: "2024-09-25", count: 11 },

    // October 2024
    { date: "2024-10-01", count: 2 },
    { date: "2024-10-10", count: 6 },
    { date: "2024-10-20", count: 3 },
    { date: "2024-10-31", count: 10 },

    // November 2024
    { date: "2024-11-05", count: 8 },
    { date: "2024-11-15", count: 13 },
    { date: "2024-11-25", count: 5 },

    // December 2024
    { date: "2024-12-01", count: 0 },
    { date: "2024-12-10", count: 7 },
    { date: "2024-12-20", count: 10 },
    { date: "2024-12-25", count: 2 }, // Holiday low
    { date: "2024-12-31", count: 18 }, // End of year surge

    // January 2025
    { date: "2025-01-01", count: 0 },
    { date: "2025-01-05", count: 4 },
    { date: "2025-01-15", count: 9 },
    { date: "2025-01-25", count: 6 },

    // February 2025
    { date: "2025-02-01", count: 1 },
    { date: "2025-02-10", count: 3 },
    { date: "2025-02-20", count: 7 },

    // March 2025
    { date: "2025-03-01", count: 5 },
    { date: "2025-03-10", count: 11 },
    { date: "2025-03-20", count: 16 },
    { date: "2025-03-31", count: 8 },

    // April 2025
    { date: "2025-04-05", count: 2 },
    { date: "2025-04-15", count: 6 },
    { date: "2025-04-25", count: 9 },

    // May 2025
    { date: "2025-05-01", count: 1 },
    { date: "2025-05-10", count: 4 },
    { date: "2025-05-20", count: 7 },

    // June 2025
    { date: "2025-06-01", count: 3 },
    { date: "2025-06-10", count: 8 },
    { date: "2025-06-20", count: 12 },
    { date: "2025-06-30", count: 5 },

    // July 2025 (leading up to today)
    { date: "2025-07-01", count: 4 },
    { date: "2025-07-05", count: 7 },
    { date: "2025-07-10", count: 10 },
    { date: "2025-07-15", count: 14 },
    { date: "2025-07-18", count: 9 },
    { date: "2025-07-19", count: 6 },
    { date: "2025-07-20", count: 3 },
    { date: "2025-07-21", count: 1 },
    { date: "2025-07-22", count: 5 }, // Today
];
// --- END DEMO DATA ---


interface HeatmapValue {
    date: string; // YYYY-MM-DD format
    count: number;
}

// No props needed as we're using static demo data
export function UserActivityHeatmap() {
    const today = new Date();
    const oneYearAgo = subDays(today, 365); // Roughly a year ago from today

    // Define the date range for the heatmap, ensuring it spans a full year
    const endDateForHeatmap = today;
    const startDateForHeatmap = subDays(today, 365); // Go back exactly 365 days

    // Generate an array of the first day of each month within the year-long interval
    const monthsToDisplay = eachMonthOfInterval({
        start: startOfMonth(startDateForHeatmap), // Start from the beginning of the first month in the range
        end: endOfMonth(endDateForHeatmap),     // End at the end of the last month in the range
    });

    const relevantData = React.useMemo(() => {
        return staticDemoHeatmapData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDateForHeatmap && itemDate <= endDateForHeatmap;
        });
    }, [startDateForHeatmap, endDateForHeatmap]); // Re-filter only if the overall date range changes

    return (
        // Main container with dark theme, enabling horizontal scrolling if content overflows
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800 text-white overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Your Activity Heatmap (Last Year - Demo)</h2>

            {/* Outer container for the individual month heatmaps:
          - flex: arranges items horizontally
          - space-x-4: adds horizontal gaps between month blocks
          - pb-4: adds padding-bottom for potential scrollbar */}
            <div className="flex space-x-4 pb-4">
                {monthsToDisplay.map((monthStart, index) => {
                    const monthEndDate = endOfMonth(monthStart);
                    const monthStartDate = startOfMonth(monthStart);

                    // Filter data for the current month
                    const monthData = relevantData.filter(item => {
                        const itemDate = new Date(item.date);
                        return isWithinInterval(itemDate, { start: monthStartDate, end: monthEndDate });
                    });

                    // CalendarHeatmap expects dates to be aligned to a week start/end (Sunday to Saturday).
                    // We adjust the start/end dates for each month's heatmap to cover full weeks.
                    const heatmapRenderStartDate = startOfWeek(monthStartDate, { weekStartsOn: 0 }); // Sunday is 0
                    const heatmapRenderEndDate = endOfWeek(monthEndDate, { weekStartsOn: 0 });

                    return (
                        // flex-shrink-0: prevents the month blocks from shrinking to fit,
                        // ensuring they maintain their size and trigger overflow-x-auto
                        <div key={format(monthStart, 'yyyy-MM')} className="flex-shrink-0">
                            {/* Month label above each heatmap block */}
                            <h3 className="text-sm font-medium text-center mb-1 text-gray-300">
                                {format(monthStart, 'MMM yyyy')}
                            </h3>
                            <CalendarHeatmap
                                startDate={heatmapRenderStartDate} // Render just enough weeks for the month
                                endDate={heatmapRenderEndDate}
                                values={monthData} // Data for this specific month
                                // Styles for cells based on activity count (dark theme)
                                classForValue={(value: HeatmapValue | null) => {
                                    if (!value || value.count === 0) {
                                        return 'fill-gray-900'; // Very dark gray for empty/no data days
                                    }
                                    // Assign colors based on count (lighter/more vibrant for more activity)
                                    if (value.count > 0 && value.count < 5) return 'fill-[#0e4429]'; // Dark green (low activity)
                                    if (value.count >= 5 && value.count < 10) return 'fill-[#006d32]'; // Medium green
                                    if (value.count >= 10 && value.count < 20) return 'fill-[#26a745]'; // Brighter green
                                    return 'fill-[#39d353]'; // Lightest green (highest activity)
                                }}
                                tooltipDataAttrs={(value: HeatmapValue) => {
                                    if (!value || !value.date) {
                                        return { 'data-tip': 'No activity' };
                                    }
                                    const formattedDate = format(new Date(value.date), 'MMM d, yyyy');
                                    return {
                                        'data-tip': `${value.count || 0} activities on ${formattedDate}`,
                                    };
                                }}
                                showWeekdayLabels={false} // No need for labels on individual month heatmaps
                                showMonthLabels={false} // No need for labels on individual month heatmaps
                                gutterSize={1} // Small gap between individual day cells
                            />
                        </div>
                    );
                })}
            </div>

            {/* Consolidated legend for the entire heatmap */}
            <div className="flex justify-end mt-4 text-sm text-gray-400">
                <span className="mr-2">Less</span>
                <div className="flex space-x-1">
                    <span className="w-4 h-4 rounded-sm bg-gray-900"></span> {/* Corresponds to color-scale-0/empty */}
                    <span className="w-4 h-4 rounded-sm bg-[#0e4429]"></span> {/* Corresponds to color-scale-1 */}
                    <span className="w-4 h-4 rounded-sm bg-[#006d32]"></span> {/* Corresponds to color-scale-2 */}
                    <span className="w-4 h-4 rounded-sm bg-[#26a745]"></span> {/* Corresponds to color-scale-3 */}
                    <span className="w-4 h-4 rounded-sm bg-[#39d353]"></span> {/* Corresponds to color-scale-4 */}
                </div>
                <span className="ml-2">More</span>
            </div>
        </div>
    );
}