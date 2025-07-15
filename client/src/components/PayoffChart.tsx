import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function PayoffChart() {
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
                <div className="h-[300px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-lg font-medium">Chart Visualization Area</p>
                        <p className="text-sm">Interactive payoff diagram will be displayed here</p>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Options Strategy Payoff Chart</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-600">Max Gain:</span>
                            <span className="ml-2 font-semibold text-green-600">57000</span>
                        </div>
                        <div>
                            <span className="text-slate-600">Straddle Prem:</span>
                            <span className="ml-2 font-semibold text-blue-600">1320</span>
                        </div>
                        <div>
                            <span className="text-slate-600">Spot:</span>
                            <span className="ml-2 font-semibold">56754.70</span>
                        </div>
                        <div>
                            <span className="text-slate-600">ATM IV:</span>
                            <span className="ml-2 font-semibold">12.3</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}