import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

// Define the interface for the CompanyInfo component's props
export interface CompanyInfoProps {
    symbol: string;
    name: string;
    exchange: string;
}

// Company Info Component as a functional component with TypeScript props
const CompanyInfo: React.FC<CompanyInfoProps> = ({ symbol, name, exchange }) => {
    return (
        <div className="bg-pink-100 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-gray-900 font-semibold text-lg">{name}</h2>
                        <p className="text-gray-600 text-sm">{exchange}:{symbol}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600">
                    <Heart className="w-5 h-5 mr-2" />
                    Watchlist Manager
                </Button>
            </div>
        </div>
    );
};

export default CompanyInfo;
