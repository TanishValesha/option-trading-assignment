// components/ValueCard.tsx

import React from 'react';
import { Card, CardContent } from '../ui/card';
export interface ValueCardProps {
    type: string;
    value: string;
    currency: string;
    icon: React.ElementType;
}

const ValueCard: React.FC<ValueCardProps> = ({ type, value, currency, icon: Icon }) => {
    return (
        <Card className="bg-white border text-black !py-2">
            <CardContent className="flex items-center justify-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <div className='flex justify-center items-center gap-2'>
                    <div className="text-gray-700 text-sm">{type}</div>
                    <div className="font-bold text-lg ml-2">
                        {value} <span className="text-gray-500 text-sm font-normal">{currency}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ValueCard;
