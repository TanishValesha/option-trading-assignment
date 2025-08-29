// components/IntrinsicValueContent.tsx

import React from 'react';
import { Calculator, BarChart3 } from 'lucide-react';

import ValueCard from './ValueCard'; // Import the ValueCard component
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

// Define the interface for the IntrinsicValueContent component's props
export interface IntrinsicValueContentProps {
    dcfValue: string;
    relativeValue: string;
    currency: string;
}

// Main Content Component as a functional component with TypeScript props
const IntrinsicValueContent: React.FC<IntrinsicValueContentProps> = ({ dcfValue, relativeValue, currency }) => {
    return (
        <Card className="bg-gray-100 border-0">
            <CardContent className="p-8">
                <p className="text-gray-700 mb-4 text-base leading-relaxed">
                    The intrinsic value of one{' '}
                    <span className="inline-flex items-center mx-1">
                        <span className="w-3 h-3 bg-red-600 mr-1 rounded-sm"></span>
                        <span className="font-semibold">BAC</span>
                    </span>{' '}
                    stock under the base case scenario is{' '}
                    <span className="font-bold">58.75 USD</span>. Compared to the current market price of 48.19{' '}
                    <span className="text-gray-500">USD</span>, Bank of America Corp is{' '}
                    <Button variant="link" className="text-blue-600 font-semibold underline p-0 h-auto">
                        undervalued by 18%
                    </Button>.
                </p>
                <p className="text-gray-700 mb-8 text-base">
                    The Intrinsic Value is calculated as the average of DCF and Relative values:
                </p>
                <div className="flex items-center gap-6">
                    <ValueCard
                        type="DCF Value"
                        value={dcfValue}
                        currency={currency}
                        icon={Calculator}
                    />

                    <div className="text-gray-400 text-2xl font-light">+</div>

                    <ValueCard
                        type="Relative Value"
                        value={relativeValue}
                        currency={currency}
                        icon={BarChart3}
                    />
                </div>
                <div className="mt-8 flex gap-6 text-blue-600 text-sm">
                    <Button variant="link" className="text-blue-600 underline p-0 h-auto hover:text-blue-800">
                        What is Intrinsic Value?
                    </Button>
                    <span className="text-gray-400">•</span>
                    <Button variant="link" className="text-blue-600 underline p-0 h-auto hover:text-blue-800">
                        What is DCF Value?
                    </Button>
                    <span className="text-gray-400">•</span>
                    <Button variant="link" className="text-blue-600 underline p-0 h-auto hover:text-blue-800">
                        What is Relative Value?
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default IntrinsicValueContent;
