import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Loader2, AlertCircle } from 'lucide-react';

interface ControlsProps {
    timeframes: string[];
    selectedTimeframe: string;
    onSelectTimeframe: (timeframe: string) => void;
    loadingMessage?: string;
    errorMessage?: string;
}

const Controls: React.FC<ControlsProps> = ({
    timeframes,
    selectedTimeframe,
    onSelectTimeframe,
    loadingMessage,
    errorMessage
}) => {
    return (
        <Card className="bg-white dark:bg-transparent border-none border-gray-200 dark:border-gray-800 shadow-lg mb-4">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Timeframe Selection */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-black dark:text-white" />
                            <label className="text-sm font-medium text-black dark:text-white">
                                Timeframe:
                            </label>
                        </div>

                        <Select
                            value={selectedTimeframe}
                            onValueChange={onSelectTimeframe}
                        >
                            <SelectTrigger className="w-48 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900">
                                <SelectValue placeholder="Select Timeframe" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600">
                                {timeframes.map((file) => (
                                    <SelectItem
                                        key={file}
                                        value={file}
                                        className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                                    >
                                        {file}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading Message */}
                    {loadingMessage && (
                        <Alert className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white" />
                            <AlertDescription className="text-black dark:text-white ml-2">
                                {loadingMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <Alert className="flex-1 bg-white dark:bg-black border border-red-300 dark:border-red-700">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-600 dark:text-red-400 ml-2">
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Controls;