import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import clsx from 'clsx';
import type { PositionRow } from "@/lib/PositionType";
import { ChartComponent } from "./ChartComponent";
import { useTheme } from "@/hooks/useTheme";


interface PayoffChartProps {
    positions: PositionRow[];
    spotPrice: number;
    lotSize?: number;
}

export function PayoffChart({ positions, spotPrice }: PayoffChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Card className={clsx(
            "h-full",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className={clsx(
                        "text-lg font-semibold",
                        isDark ? "text-gray-100" : "text-gray-900"
                    )}>Options Payoff Chart</CardTitle>
                    <Badge
                        variant="secondary"
                        className={clsx(
                            isDark
                                ? "bg-blue-900 text-blue-200 border-blue-700"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                    >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Strategy Analysis
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {positions.length != 0 ? (
                    <ChartComponent theme={theme} positions={positions} spotPrice={spotPrice} lotSize={35} />
                ) : (
                    <div className={clsx(
                        "h-[300px] rounded-lg border-2 border-dashed flex items-center justify-center",
                        isDark
                            ? "bg-gray-800 border-gray-600"
                            : "bg-slate-50 border-slate-200"
                    )}>
                        <div className="text-center">
                            <TrendingUp className={clsx(
                                "w-12 h-12 mx-auto mb-3",
                                isDark ? "text-gray-500" : "text-slate-400"
                            )} />
                            <p className={clsx(
                                "text-lg font-medium",
                                isDark ? "text-gray-300" : "text-slate-500"
                            )}>Chart Visualization Area</p>
                            <p className={clsx(
                                "text-sm",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>Interactive payoff diagram will be displayed here on adding positions</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}