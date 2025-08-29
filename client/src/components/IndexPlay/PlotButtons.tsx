import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, AlertCircle } from 'lucide-react';

type PlotButtonsProps = {
    onPlotCandles: (count: number) => void;
    plottedCandleIndex: number;
    fullDataLength: number;
};

const PlotButtons = ({ onPlotCandles, plottedCandleIndex, fullDataLength }: PlotButtonsProps) => {
    const isPlotDisabled = plottedCandleIndex >= fullDataLength;

    const buttonConfigs = [
        { count: 1, label: 'Plot Next Candle' },
        { count: 2, label: 'Plot 2 Candles' },
        { count: 5, label: 'Plot 5 Candles' }
    ];

    return (
        <Card className="bg-white border-none dark:bg-transparent mt-4">
            <CardContent className="p-4">
                <div className="flex gap-3 justify-center">
                    {buttonConfigs.map(({ count, label }) => (
                        <Button
                            key={count}
                            onClick={() => onPlotCandles(count)}
                            disabled={isPlotDisabled}
                            variant={isPlotDisabled ? "secondary" : "default"}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${isPlotDisabled
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                                : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-black dark:border-white'
                                }`}
                        >
                            {isPlotDisabled && count === 1 ? (
                                <AlertCircle className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            <span>
                                {isPlotDisabled && count === 1 ? 'No More Data' : label}
                            </span>
                        </Button>
                    ))}
                </div>

                {/* Progress indicator */}
                {/* <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Progress</span>
                        <span>{plottedCandleIndex} / {fullDataLength}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.min((plottedCandleIndex / fullDataLength) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div> */}
            </CardContent>
        </Card>
    );
};

export default PlotButtons;