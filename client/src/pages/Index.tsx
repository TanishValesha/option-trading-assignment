import { MarketHeader } from "@/components/MarketHeader";
import { ResizableLayout } from "@/components/ResizableLayout";
import { useState } from "react";

const Index = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2021, 0, 1));
    const [selectedTime, setSelectedTime] = useState('09:15:00');
    return (
        <div className="min-h-screen w-screen bg-slate-50">
            <MarketHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            <div className="w-full max-w-none">
                <ResizableLayout date={selectedDate} time={selectedTime} />
            </div>
        </div>
    );
};

export default Index;