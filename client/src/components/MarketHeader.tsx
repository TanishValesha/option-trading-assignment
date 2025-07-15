import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock } from "lucide-react";

export function MarketHeader() {
    const timeframes = ['1 Day', '5OD', '-2h', '-30m', '-15m', '-5m', '-1m', '05/01/2025', '15', '30', '1m', '5m', '15m', '30m', '2hr', 'EOD', 'Day'];

    return (
        <div className="bg-white w-full border-b border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold">NIFTY Options Dashboard</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Live
                    </Badge>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">ATM IV</div>
                        <div className="font-bold text-blue-600">12.3</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Spot</div>
                        <div className="font-bold">56754.70</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Straddle Prem</div>
                        <div className="font-bold text-purple-600">1320</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Max Pain</div>
                        <div className="font-bold text-orange-600">57000</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
                {timeframes.map((tf, index) => (
                    <Button
                        key={index}
                        variant={tf === '5OD' ? "default" : "outline"}
                        size="sm"
                        className={`h-8 px-3 whitespace-nowrap ${tf === '5OD'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'hover:bg-slate-50'
                            }`}
                    >
                        {tf}
                    </Button>
                ))}
            </div>
        </div>
    );
}