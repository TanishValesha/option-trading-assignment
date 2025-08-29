import { DollarSign, Shield, TrendingUp } from 'lucide-react';

interface InvestorReturn {
    label: string;
    value: string;
    status: 'safe' | 'moderate' | 'high';
}

interface InvestorReturnsProps {
    returns: InvestorReturn[];
}

const InvestorReturns = ({ returns }: InvestorReturnsProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe': return 'text-blue-600 bg-blue-50';
            case 'moderate': return 'text-orange-600 bg-orange-50';
            case 'high': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Investor Returns</h3>
            </div>

            <div className="space-y-3">
                {returns.map((returnItem, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {returnItem.label === 'Dividend Safety' && <Shield className="w-4 h-4 text-blue-500" />}
                            {returnItem.label === 'Dividend Yield' && <DollarSign className="w-4 h-4 text-green-500" />}
                            {returnItem.label === 'Buyback Yield' && <TrendingUp className="w-4 h-4 text-purple-500" />}
                            <span className="text-sm text-gray-600">{returnItem.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{returnItem.value}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(returnItem.status)}`}>
                                {returnItem.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InvestorReturns