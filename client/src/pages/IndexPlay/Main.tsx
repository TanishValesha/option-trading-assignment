import { useState, useEffect, useCallback } from 'react';
import ChartCard from '../../components/IndexPlay/ChartCard';
import Header from '../../components/IndexPlay/Header';
import Controls from '../../components/IndexPlay/Control';
import IndicatorPanel from '../../components/IndexPlay/IndicatorPanel';
import CandlestickChart from '../../components/IndexPlay/CandlestickChart';
import PlotButtons from '../../components/IndexPlay/PlotButtons';

// Utility functions (e.g., SMA, EMA, PSAR calculations) would ideally be in a separate 'utils' file.
// For simplicity in this example, they are placed here.
import { calculateSMA, calculateEMA, calculatePSAR } from '../../lib/chartCalculations';

const SERVER_URL = 'https://flask-server-elds.onrender.com';
const INITIAL_DATA_POINTS = 40;
const VISIBLE_WINDOW_SIZE = 60;

// Define an interface for a single candlestick data point
interface CandlestickData {
    x: string; // Timestamp
    y: [number, number, number, number]; // [Open, High, Low, Close]
}

// Define an interface for the last price information
interface LastPriceInfo {
    currentPrice: string;
    previousPrice: string;
    timestamp: string | null;
}

// Define the shape of the indicator states
interface IndicatorStates {
    sma: { '9': boolean; '13': boolean; '21': boolean; '50': boolean; '200': boolean; };
    ema: { '9': boolean; '13': boolean; '21': boolean; '50': boolean; '200': boolean; };
    psar: boolean;
}

// Colors for indicators - Adjusted as per request
const indicatorColors: { [key: string]: string } = {
    'SMA_9': '#FFA500',   // Orange
    'SMA_13': '#FFD700',  // Gold
    'SMA_21': '#F5F5F5',  // White (light gray shade)
    'SMA_50': '#FF4500',  // OrangeRed (red shade)
    'SMA_200': '#008000', // Green (green shade)
    'EMA_9': '#32CD32',   // Lime Green
    'EMA_13': '#ADFF2F',  // Green Yellow
    'EMA_21': '#A9A9A9',  // DarkGray (gray shade)
    'EMA_50': '#DC143C',  // Crimson (red shade)
    'EMA_200': '#228B22',  // ForestGreen (green shade)
    'PSAR': '#87CEEB' // Sky Blue for PSAR
};

function IndexPlay() { // Specify return type as JSX.Element
    const [fullData, setFullData] = useState<CandlestickData[]>([]);
    const [currentChartData, setCurrentChartData] = useState<CandlestickData[]>([]);
    const [plottedCandleIndex, setPlottedCandleIndex] = useState<number>(0);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [timeframes, setTimeframes] = useState<string[]>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>('');
    const [lastPriceInfo, setLastPriceInfo] = useState<LastPriceInfo>({ currentPrice: 'N/A', previousPrice: 'N/A', timestamp: null });
    const [indicatorStates, setIndicatorStates] = useState<IndicatorStates>({
        sma: { '9': false, '13': false, '21': false, '50': false, '200': false },
        ema: { '9': false, '13': false, '21': false, '50': false, '200': false },
        psar: false
    });
    const [isIndicatorPanelHidden, setIsIndicatorPanelHidden] = useState<boolean>(false);

    // Updates the last price and date display box.
    const updateInfoBox = useCallback((currentPrice: string, previousPrice: string, timestamp: string | null): void => {
        setLastPriceInfo({ currentPrice, previousPrice, timestamp });
    }, []);

    // Plots a specified number of next available candles from the historical data.
    const plotCandles = useCallback((numCandles: number = 1): void => {
        let candlesPlotted = 0;
        const newCurrentChartData = [...currentChartData];

        while (candlesPlotted < numCandles && plottedCandleIndex + candlesPlotted < fullData.length) {
            const nextDataPoint = fullData[plottedCandleIndex + candlesPlotted];
            newCurrentChartData.push(nextDataPoint);
            candlesPlotted++;
        }

        setCurrentChartData(newCurrentChartData);
        setPlottedCandleIndex(prevIndex => prevIndex + candlesPlotted);

        // Update last price info box
        if (newCurrentChartData.length > 0) {
            const lastDataPoint = newCurrentChartData[newCurrentChartData.length - 1];
            const currentPrice = parseFloat(lastDataPoint.y[3].toString()); // Ensure it's treated as string for parseFloat
            const timestamp = lastDataPoint.x;
            const previousPrice = newCurrentChartData.length > 1 ? parseFloat(newCurrentChartData[newCurrentChartData.length - 2].y[3].toString()) : currentPrice;
            updateInfoBox(currentPrice.toString(), previousPrice.toString(), timestamp);
        } else {
            updateInfoBox('N/A', 'N/A', null);
        }
    }, [currentChartData, fullData, plottedCandleIndex, updateInfoBox]);

    // Toggles the visibility and calculation of a specific SMA/EMA/PSAR line.
    const toggleIndicator = useCallback((type: 'sma' | 'ema' | 'psar', period: string | null): void => {
        setIndicatorStates(prevState => {
            if (type === 'psar') {
                return { ...prevState, psar: !prevState.psar };
            } else if (period && ['9', '13', '21', '50', '200'].includes(period)) {
                return { ...prevState, [type]: { ...prevState[type], [period]: !prevState[type][period as keyof typeof prevState[typeof type]] } };
            } else {
                return prevState;
            }
        });
    }, []);

    // Fetches the list of available CSV files from the server and populates the dropdown.
    const fetchTimeframes = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${SERVER_URL}/files`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const files: string[] = await response.json();
            setTimeframes(files);

            // Automatically select NIFTY__1D__.csv if available
            if (files.includes('NIFTY__1D__.csv')) {
                setSelectedTimeframe('NIFTY__1D__.csv');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) { // Use 'any' for caught error if unsure of its type, or narrow it down
            console.error('Error fetching timeframes:', error);
            setErrorMessage(`Could not load file list. Is the server running? ${error.message}`);
        }
    }, []);

    // Loads candlestick data from the selected CSV file on the server.
    const loadSelectedData = useCallback(async (): Promise<void> => {
        setLoadingMessage('Loading data...');
        setErrorMessage('');
        updateInfoBox('N/A', 'N/A', null); // Reset info box

        if (!selectedTimeframe) {
            setErrorMessage('Please select a timeframe.');
            setLoadingMessage('');
            setCurrentChartData([]);
            setFullData([]);
            setPlottedCandleIndex(0);
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/data/${selectedTimeframe}`);
            if (!response.ok) {
                const errorJson: { error?: string } = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorJson.error || response.statusText}`);
            }
            const data: CandlestickData[] = await response.json();

            if (data.length === 0) {
                setErrorMessage(`No data found in '${selectedTimeframe}'. Please ensure the file is uploaded and contains data.`);
                setCurrentChartData([]);
                setFullData([]);
                setPlottedCandleIndex(0);
            } else {
                setFullData(data);
                const initialData = data.slice(0, INITIAL_DATA_POINTS);
                setCurrentChartData(initialData);
                setPlottedCandleIndex(INITIAL_DATA_POINTS);

                // Update info box with initial data
                if (initialData.length > 0) {
                    const lastDataPoint = initialData[initialData.length - 1];
                    const currentPrice = lastDataPoint.y[3].toString();
                    const timestamp = lastDataPoint.x;
                    const previousPrice = initialData.length > 1 ? initialData[initialData.length - 2].y[3].toString() : currentPrice;
                    updateInfoBox(currentPrice, previousPrice, timestamp);
                } else {
                    updateInfoBox('N/A', 'N/A', null);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error loading data:', error);
            setErrorMessage(`Error loading data from '${selectedTimeframe}': ${error.message}. Is the server running and the file uploaded?`);
            setCurrentChartData([]);
            setFullData([]);
            setPlottedCandleIndex(0);
        } finally {
            setLoadingMessage('');
        }
    }, [selectedTimeframe, updateInfoBox]);

    // Fetch timeframes on component mount
    useEffect(() => {
        fetchTimeframes();
    }, [fetchTimeframes]);

    // Load data when selectedTimeframe changes (after initial fetch)
    useEffect(() => {
        if (selectedTimeframe) {
            loadSelectedData();
        }
    }, [selectedTimeframe, loadSelectedData]);

    return (
        <div className="p-10 sm:p-6 lg:px-20 w-screen">
            <ChartCard>
                <Header
                    lastPriceInfo={lastPriceInfo}
                    onToggleIndicatorPanel={() => setIsIndicatorPanelHidden(prev => !prev)}
                    isIndicatorPanelHidden={isIndicatorPanelHidden}
                />

                <Controls
                    timeframes={timeframes}
                    selectedTimeframe={selectedTimeframe}
                    onSelectTimeframe={setSelectedTimeframe}
                    loadingMessage={loadingMessage}
                    errorMessage={errorMessage}
                />

                <IndicatorPanel
                    indicatorStates={indicatorStates}
                    onToggleIndicator={toggleIndicator}
                    isHidden={isIndicatorPanelHidden}
                />

                <CandlestickChart
                    currentChartData={currentChartData}
                    indicatorStates={indicatorStates}
                    indicatorColors={indicatorColors}
                    VISIBLE_WINDOW_SIZE={VISIBLE_WINDOW_SIZE}
                    // ADD THESE THREE LINES:
                    calculateSMA={calculateSMA}
                    calculateEMA={calculateEMA}
                    calculatePSAR={calculatePSAR}
                />

                {currentChartData.length === 0 && !loadingMessage && !errorMessage && (
                    <p id="noDataMessage" className="text-center text-gray-400 mt-4">
                        No data loaded. Please select a timeframe and click 'Load Data'.
                    </p>
                )}

                <PlotButtons
                    onPlotCandles={plotCandles}
                    plottedCandleIndex={plottedCandleIndex}
                    fullDataLength={fullData.length}
                />
            </ChartCard>

            <div className="mt-6 text-center text-gray-500 text-sm">
                <p>This chart displays real historical data loaded from the server.</p>
            </div>
        </div>
    );
}

export default IndexPlay;