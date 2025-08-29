

import { TrendingUp } from 'lucide-react';

interface WallStEstimate {
    label: string;
    value: string;
    trend: 'up' | 'down';
    percentage: string;
}

interface WallStEstimatesProps {
    estimates: WallStEstimate[];
}

const WallStEstimates = ({ estimates }: WallStEstimatesProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Wall St Estimates</h3>
            </div>

            <div className="space-y-4">
                {estimates.map((estimate, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{estimate.label}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600">{estimate.percentage}</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.abs(parseInt(estimate.percentage))}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WallStEstimates