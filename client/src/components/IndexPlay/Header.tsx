import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Eye, EyeOff, Activity, Calendar } from 'lucide-react';

interface LastPriceInfo {
    currentPrice: string;
    previousPrice: string;
    timestamp?: string | null;
}

interface HeaderProps {
    lastPriceInfo: LastPriceInfo;
    onToggleIndicatorPanel: () => void;
    isIndicatorPanelHidden: boolean;
}

const Header: React.FC<HeaderProps> = ({ lastPriceInfo, onToggleIndicatorPanel, isIndicatorPanelHidden }) => {
    const { currentPrice, previousPrice, timestamp } = lastPriceInfo;

    const currentPriceNum = parseFloat(currentPrice);
    const previousPriceNum = parseFloat(previousPrice);
    const isUp = currentPriceNum >= previousPriceNum;
    const isNa = currentPrice === 'N/A';

    const priceChange = !isNa ? (currentPriceNum - previousPriceNum).toFixed(2) : '0.00';
    const priceChangePercent = !isNa && previousPriceNum !== 0
        ? (((currentPriceNum - previousPriceNum) / previousPriceNum) * 100).toFixed(2)
        : '0.00';

    const priceClass = isNa
        ? 'text-gray-400 dark:text-gray-500'
        : isUp
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400';

    const formattedDate = timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) : 'N/A';

    const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : 'N/A';

    return (
        <Card className="bg-transparent border-none border-gray-200 dark:border-gray-800 shadow-lg mb-6">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Left Section - Title and Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-black dark:text-white" />
                            <div>
                                <h1 className="text-xl font-bold text-black dark:text-white">
                                    NIFTY 50
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Live Trading Simulation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Center Section - Price Information */}


                    {/* Right Section - Controls */}
                    <div className="flex flex-col gap-3">
                        <div className="flex-1 lg:flex lg:justify-center">
                            <Card className="bg-gray-50 dark:bg-[#1a1919] border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Last Close Price
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {!isNa && (isUp ?
                                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-3">
                                        <span className={`text-3xl font-bold ${priceClass}`}>
                                            {!isNa ? currentPriceNum.toFixed(2) : 'N/A'}
                                        </span>
                                        {!isNa && (
                                            <div className="flex flex-col items-end">
                                                <span className={`text-sm font-medium ${priceClass}`}>
                                                    {isUp ? '+' : ''}{priceChange}
                                                </span>
                                                <span className={`text-xs ${priceClass}`}>
                                                    ({isUp ? '+' : ''}{priceChangePercent}%)
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formattedDate}</span>
                                        <span>•</span>
                                        <span>{formattedTime}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <Button
                            onClick={onToggleIndicatorPanel}
                            variant={isIndicatorPanelHidden ? "default" : "secondary"}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 ${isIndicatorPanelHidden
                                ? 'bg-[#1a1919] text-white hover:bg-[#1a1919] dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-black dark:border-white'
                                : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                }`}
                        >
                            {isIndicatorPanelHidden ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <EyeOff className="w-4 h-4" />
                            )}
                            <span>
                                {isIndicatorPanelHidden ? 'Show Indicators' : 'Hide Indicators'}
                            </span>
                        </Button>

                        {/* <div className="text-center">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                Market Status
                            </span>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Simulation Active
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Header;