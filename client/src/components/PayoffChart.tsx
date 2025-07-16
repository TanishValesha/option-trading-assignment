import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import type { PositionRow } from "@/lib/PositionType";
import { ChartComponent } from "./ChartComponent";

interface PayoffChartProps {
    positions: PositionRow[];
    spotPrice: number;
    lotSize?: number;
}

export function PayoffChart({ positions, spotPrice }: PayoffChartProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Options Payoff Chart</CardTitle>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Strategy Analysis
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ChartComponent positions={positions} spotPrice={spotPrice} lotSize={35} />
                {/* <div className="h-[300px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-lg font-medium">Chart Visualization Area</p>
                        <p className="text-sm">Interactive payoff diagram will be displayed here</p>
                    </div>
                </div> */}
            </CardContent>
        </Card>
    );
}