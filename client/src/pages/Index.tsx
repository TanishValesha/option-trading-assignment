import { MarketHeader } from "@/components/MarketHeader";
import { ResizableLayout } from "@/components/ResizableLayout";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

interface Meta {
    dayOpen: number;
    spot: number;
    atm_iv: number;
    fut_price: number;
}

const Index = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2021, 0, 1));
    const [selectedTime, setSelectedTime] = useState('09:15:00');
    const { theme } = useTheme();
    const [meta, setMeta] = useState<Meta>({
        dayOpen: 0,
        spot: 0,
        atm_iv: 0,
        fut_price: 0
    });
    return (
        <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-slate-50'}`}>
            <MarketHeader meta={meta} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            <div className="w-full max-w-none">
                <ResizableLayout setMeta={setMeta} theme={theme} date={selectedDate} time={selectedTime} meta={meta} />
            </div>
        </div>
    );
};

export default Index;