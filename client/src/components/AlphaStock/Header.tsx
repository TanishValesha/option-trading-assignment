import React from 'react';


export interface HeaderProps {
    price: string;
    change: string;
    marketCap: string;
}

// Header Component as a functional component with TypeScript props
const Header: React.FC<HeaderProps> = ({ price, change, marketCap }) => {
    return (
        <div className="bg-red-600 relative overflow-hidden">
            {/* 3D Logo elements */}
            <div className="absolute right-8 top-4">
                <div className="relative">
                    <div className="w-20 h-12 bg-blue-600 transform rotate-12 shadow-lg border-r-2 border-b-2 border-black"></div>
                    <div className="w-20 h-12 bg-blue-700 transform rotate-12 absolute top-1 left-1 shadow-lg"></div>
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-blue-600 text-5xl font-bold tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                            BankofAmerica
                        </h1>
                        <div className="flex items-center gap-6 text-white text-sm mt-2">
                            <span>Price: {price} USD</span>
                            <span className="text-green-300">{change}</span>
                            <span className="ml-auto">Market Cap: {marketCap}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
