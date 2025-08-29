import { Calendar, TrendingUp, Users } from 'lucide-react';

interface InsiderTradingData {
    period: string;
    months: string;
    value: string;
    trend: 'up' | 'down' | 'none';
    hasBuys: boolean;
}

interface InsiderTradingProps {
    data: InsiderTradingData[];
}

const InsiderTrading = ({ data }: InsiderTradingProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Insider Trading</h3>
            </div>

            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{item.period}</span>
                            <span className="text-xs text-gray-500">{item.months}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className={`text-sm font-medium ${item.trend === 'down' ? 'text-red-600' : 'text-gray-800'}`}>
                                    {item.value}
                                </span>
                                {item.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                            </div>
                            <span className="text-xs text-gray-500">
                                {item.hasBuys ? 'Has Buys' : 'No Buys'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InsiderTrading