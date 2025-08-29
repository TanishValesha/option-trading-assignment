/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/chartCalculations.js

/**
 * Calculates the Simple Moving Average (SMA) for a given data set and period.
 * @param {Array<Object>} data - The candlestick data.
 * @param {number} period - The SMA period.
 * @returns {Array<Object>} An array of SMA data points in ApexCharts format.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateSMA(data: Array<{ x: any; y: any }>, period: number) {
    const smaValues = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            smaValues.push({ x: data[i].x, y: null });
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + parseFloat(val.y[3]), 0);
            smaValues.push({ x: data[i].x, y: parseFloat((sum / period).toFixed(2)) });
        }
    }
    return smaValues;
}

/**
 * Calculates the Exponential Moving Average (EMA) for a given data set and period.
 * @param {Array<Object>} data - The candlestick data.
 * @param {number} period - The EMA period.
 * @returns {Array<Object>} An array of EMA data points in ApexCharts format.
 */
export function calculateEMA(data: Array<{ x: any; y: any }>, period: number) {
    const emaValues = [];
    const k = 2 / (period + 1);
    let prevEma = null;

    for (let i = 0; i < data.length; i++) {
        const close = parseFloat(data[i].y[3]);
        if (i < period - 1) {
            emaValues.push({ x: data[i].x, y: null });
        } else if (i === period - 1) {
            const sum = data.slice(0, period).reduce((acc, val) => acc + parseFloat(val.y[3]), 0);
            prevEma = sum / period;
            emaValues.push({ x: data[i].x, y: parseFloat(prevEma.toFixed(2)) });
        } else {
            const currentEma: any = (close * k) + (prevEma * (1 - k));
            emaValues.push({ x: data[i].x, y: parseFloat(currentEma.toFixed(2)) });
            prevEma = currentEma;
        }
    }
    return emaValues;
}

/**
 * Calculates the Parabolic SAR (PSAR) for a given data set.
 * @param {Array<Object>} data - The candlestick data.
 * @param {number} initialAF - Initial Acceleration Factor.
 * @param {number} maxAF - Maximum Acceleration Factor.
 * @param {number} afStep - Acceleration Factor Step.
 * @returns {Array<Object>} An array of PSAR data points in ApexCharts format.
 */
export function calculatePSAR(
    data: Array<{ x: any; y: any }>,
    initialAF = 0.02,
    maxAF = 0.2,
    afStep = 0.02
) {
    const psarValues = [];
    if (data.length < 2) {
        for (let i = 0; i < data.length; i++) psarValues.push({ x: data[i].x, y: null });
        return psarValues;
    }

    let sar;
    let extremePoint;
    let accelerationFactor = initialAF;
    let isRising;

    // PSAR for the first bar is usually not plotted or is null.
    psarValues.push({ x: data[0].x, y: null });

    // Determine initial trend and EP from the first two candles
    if (parseFloat(data[1].y[3]) > parseFloat(data[0].y[3])) { // If close of 2nd > close of 1st, assume uptrend
        isRising = true;
        sar = parseFloat(data[0].y[2]); // Initial SAR for uptrend is the low of the first bar
        extremePoint = parseFloat(data[0].y[1]); // Initial EP for uptrend is the high of the first bar
    } else { // Assume downtrend
        isRising = false;
        sar = parseFloat(data[0].y[1]); // Initial SAR for downtrend is the high of the first bar
        extremePoint = parseFloat(data[0].y[2]); // Initial EP for downtrend is the low of the first bar
    }

    for (let i = 1; i < data.length; i++) {
        const currentHigh = parseFloat(data[i].y[1]);
        const currentLow = parseFloat(data[i].y[2]);
        const prevHigh = parseFloat(data[i-1].y[1]);
        const prevLow = parseFloat(data[i-1].y[2]);

        let calculatedSar: any = sar + accelerationFactor * (extremePoint - sar);

        // Clamp calculatedSar to ensure it doesn't cross the previous bar's high/low
        if (isRising) {
            calculatedSar = Math.min(calculatedSar, prevLow);
        } else { // Downtrend
            calculatedSar = Math.max(calculatedSar, prevHigh);
        }

        // Check for reversal
        let reversed = false;
        if (isRising && currentLow < calculatedSar) { // Uptrend reverses if current low is below calculated SAR
            isRising = false;
            sar = extremePoint; // New SAR is the previous EP
            extremePoint = currentLow; // New EP is current low
            accelerationFactor = initialAF;
            reversed = true;
        } else if (!isRising && currentHigh > calculatedSar) { // Downtrend reverses if current high is above calculated SAR
            isRising = true;
            sar = extremePoint; // New SAR is the previous EP
            extremePoint = currentHigh; // New EP is current high
            accelerationFactor = initialAF;
            reversed = true;
        }

        if (!reversed) {
            // Update EP and AF if no reversal
            if (isRising && currentHigh > extremePoint) {
                extremePoint = currentHigh;
                accelerationFactor = Math.min(accelerationFactor + afStep, maxAF);
            } else if (!isRising && currentLow < extremePoint) {
                extremePoint = currentLow;
                accelerationFactor = Math.min(accelerationFactor + afStep, maxAF);
            }
            sar = calculatedSar; // Update SAR with the calculated value if no reversal
        }

        psarValues.push({ x: data[i].x, y: parseFloat(sar.toFixed(2)) });
    }
    return psarValues;
}