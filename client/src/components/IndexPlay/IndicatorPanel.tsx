import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BarChart3 } from 'lucide-react';

type IndicatorPanelProps = {
    indicatorStates: {
        sma: Record<string, boolean>;
        ema: Record<string, boolean>;
        psar: boolean;
    };
    onToggleIndicator: (type: 'sma' | 'ema' | 'psar', period: string | null) => void;
    isHidden: boolean;
};

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ indicatorStates, onToggleIndicator, isHidden }) => {
    if (isHidden) {
        return null;
    }

    return (
        <div className="w-full p-4">
            <Card className="bg-white dark:bg-transparent shadow-lg border-none">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-black dark:text-white">
                        <BarChart3 className="w-6 h-6 text-black dark:text-white" />
                        Technical Indicators
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* SMA and EMA in the same row */}
                    <div className="flex gap-8">
                        {/* SMA Section */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-black dark:text-white">Simple Moving Average (SMA)</h3>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {['9', '13', '21', '50', '200'].map(period => {
                                    const isActive = indicatorStates.sma[period];
                                    return (
                                        <div
                                            key={`sma-${period}`}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 hover:scale-105 min-w-[70px] ${isActive
                                                ? 'bg-gray-50 dark:bg-gray-900 border-black dark:border-white'
                                                : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full border-2 ${isActive
                                                    ? 'bg-black dark:bg-white border-black dark:border-white'
                                                    : 'bg-transparent border-gray-300 dark:border-gray-600'
                                                    }`} />
                                                <span className={`font-medium text-sm ${isActive
                                                    ? 'text-black dark:text-white'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {period}
                                                </span>
                                                <Switch
                                                    onCheckedChange={() => onToggleIndicator('sma', period)}
                                                    checked={isActive}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* EMA Section */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-black dark:text-white">Exponential Moving Average (EMA)</h3>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {['9', '13', '21', '50', '200'].map(period => {
                                    const isActive = indicatorStates.ema[period];
                                    return (
                                        <div
                                            key={`ema-${period}`}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 hover:scale-105 min-w-[70px] ${isActive
                                                ? 'bg-gray-50 dark:bg-gray-900 border-black dark:border-white'
                                                : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full border-2 ${isActive
                                                    ? 'bg-black dark:bg-white border-black dark:border-white'
                                                    : 'bg-transparent border-gray-300 dark:border-gray-600'
                                                    }`} />
                                                <span className={`font-medium text-sm ${isActive
                                                    ? 'text-black dark:text-white'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {period}
                                                </span>
                                                <Switch
                                                    checked={isActive}
                                                    onCheckedChange={() => onToggleIndicator('ema', period)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    {/* Other Indicators Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">

                                <h3 className="font-semibold text-black dark:text-white">Other Indicators</h3>
                            </div>
                        </div>

                        <div className="flex">
                            <div className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 hover:scale-105 min-w-[100px] ${indicatorStates.psar
                                ? 'bg-gray-50 dark:bg-gray-900 border-black dark:border-white'
                                : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full border-2 ${indicatorStates.psar
                                        ? 'bg-black dark:bg-white border-black dark:border-white'
                                        : 'bg-transparent border-gray-300 dark:border-gray-600'
                                        }`} />
                                    <div className="text-center">
                                        <span className={`font-medium text-sm block ${indicatorStates.psar
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            PSAR
                                        </span>
                                        {/* <span className="text-xs text-gray-400 dark:text-gray-500">Stop & Reverse</span> */}
                                    </div>
                                    <Switch
                                        checked={indicatorStates.psar}
                                        onCheckedChange={() => onToggleIndicator('psar', null)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    {/* <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total Active Indicators</span>
                            <Badge className="bg-black dark:bg-white text-white dark:text-black border-0">
                                {activeCount.sma + activeCount.ema + activeCount.psar}
                            </Badge>
                        </div>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default IndicatorPanel;