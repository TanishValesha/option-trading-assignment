import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Minus, Plus, TrendingUp } from "lucide-react";
import clsx from 'clsx';
import type { PositionRow } from "@/lib/PositionType";
import { ChartComponent } from "./ChartComponent";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";


interface PayoffChartProps {
    positions: PositionRow[];
    spotPrice: number;
    lotSize?: number;
}

export function PayoffChart({ positions, spotPrice }: PayoffChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [skips, setSkips] = useState(1000);

    const breakevens = [];
    for (let i = 0; i < positions.length - 1; i++) {
        const p1_price = positions[i].entry;
        const p1_pnl = positions[i].pnlAbs;
        const p2_price = positions[i + 1].entry;
        const p2_pnl = positions[i + 1].pnlAbs;
        if (Math.sign(p1_pnl) !== Math.sign(p2_pnl) || (p1_pnl === 0 && p2_pnl !== 0) || (p2_pnl === 0 && p1_pnl !== 0)) {
            if ((p2_pnl - p1_pnl) === 0) continue; // Avoid division by zero for flat P&L
            const breakeven = p1_price - p1_pnl * (p2_price - p1_price) / (p2_pnl - p1_pnl);
            // Only add if it's within the range of the two points used for interpolation
            if (breakeven >= Math.min(p1_price, p2_price) && breakeven <= Math.max(p1_price, p2_price)) {
                breakevens.push(parseFloat(breakeven.toFixed(2)));
            }
        }
    }
    const uniqueBreakevens = [...new Set(breakevens)].sort((a, b) => a - b);
    console.log(uniqueBreakevens);


    return (
        <Card className={clsx(
            "h-full",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => setSkips(skips - 100)}><Plus /></Button>
                        <Button variant="outline" onClick={() => setSkips(skips + 100)}><Minus /></Button>
                    </div>
                    <Label>Breakeven(s): {uniqueBreakevens.join(", ")}</Label>
                    {/* <Badge
                        variant="secondary"
                        className={clsx(
                            isDark
                                ? "bg-blue-900 text-blue-200 border-blue-700"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                    >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Strategy Analysis
                    </Badge> */}
                </div>
            </CardHeader>
            <CardContent>
                {positions.length != 0 ? (
                    <ChartComponent theme={theme} positions={positions} spotPrice={spotPrice} lotSize={35} skips={skips} />
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