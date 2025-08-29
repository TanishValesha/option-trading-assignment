import CandlestickChart from "@/components/TechnicalAnalysis/CandleStickChart";
import TechAnalysis from "@/components/TechnicalAnalysis/TechAnalysis";
import { useState } from "react";


const StockDashboard = () => {
    const [selectedStock, setSelectedStock] = useState<string>('');
    return (
        <div className="w-screen h-screen flex bg-black text-white">
            {/* Left side: Candlestick Chart */}
            <div className="flex-1">
                <CandlestickChart selectedStock={selectedStock} setSelectedStock={setSelectedStock} />
            </div>

            {/* Right side: Technical Analysis / Watchlist */}
            <div className="w-96 border-l border-gray-800 bg-[#111] overflow-y-auto">
                <TechAnalysis selectedStock={selectedStock} setSelectedStock={setSelectedStock} />
            </div>
        </div>
    );
};

export default StockDashboard;
