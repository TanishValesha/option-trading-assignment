// components/IntrinsicValueSidebar.tsx

import React from 'react';// Import from your ui-components file
import { Card, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// Define the interface for the IntrinsicValueSidebar component's props
export interface IntrinsicValueSidebarProps {
    intrinsicValue: string;
    currency: string;
    undervaluation: string;
    scenarios: string[];
    activeScenario: string;
}

// Intrinsic Value Sidebar Component as a functional component with TypeScript props
const IntrinsicValueSidebar: React.FC<IntrinsicValueSidebarProps> = ({ intrinsicValue, currency, undervaluation, scenarios, activeScenario }) => {
    return (
        <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-800 font-semibold">BAC Intrinsic Value</h3>
                    <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z" />
                        </svg>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="text-4xl font-light text-blue-600 mb-1">{intrinsicValue}</div>
                    <div className="text-gray-500 text-sm">{currency}</div>
                </div>
                <Badge className="bg-green-500 text-white hover:bg-green-500 mb-8">
                    UNDERVALUATION {undervaluation}
                </Badge>
                {/* Value visualization */}
                <div className="space-y-4 mb-6">
                    <div>
                        <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-500 mb-2 text-xs">
                            Intrinsic Value
                        </Badge>
                        <div className="w-full bg-blue-500 h-6 rounded shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <div className="absolute inset-0 bg-blue-600 opacity-20"></div>
                        </div>
                    </div>

                    <div>
                        <Badge variant="secondary" className="bg-gray-600 text-white hover:bg-gray-600 mb-2 text-xs">
                            Price
                        </Badge>
                        <div className="w-4/5 bg-gray-600 h-6 rounded shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700"></div>
                            <div className="absolute inset-0 bg-gray-700 opacity-20"></div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            {/* Scenario tabs */}
            <div className="flex text-sm border-t border-gray-200">
                {scenarios.map((scenario, index) => (
                    <Button
                        key={index}
                        variant={scenario === activeScenario ? "default" : "ghost"}
                        className={`flex-1 px-4 py-3 h-auto rounded-none border-r border-gray-200 last:border-r-0 ${scenario === activeScenario
                            ? 'bg-gray-800 text-white font-semibold hover:bg-gray-800'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {scenario}
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default IntrinsicValueSidebar;
