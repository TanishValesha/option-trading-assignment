import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, ChevronDown, CalendarIcon, ChevronRight, ChevronLeft, ChevronFirst, ChevronLast } from "lucide-react";
import { useEffect, useState } from "react";
import { baseURL } from "@/lib/baseURL";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function MarketHeader() {
    const [times, setTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2021, 0));
    const [selectedTime, setSelectedTime] = useState('09:15:00');

    const handlePrevDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    }

    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    }

    const handlePrevTS = () => {
        const currentIndex = times.indexOf(selectedTime);
        if (currentIndex > 0) {
            setSelectedTime(times[currentIndex - 1]);
        }

    }

    const handleNextTS = () => {
        const currentIndex = times.indexOf(selectedTime);
        if (currentIndex < times.length && times.length > 0) {
            setSelectedTime(times[currentIndex + 1]);
        }
    }

    const handleFirstTS = () => {
        if (times.length > 0) setSelectedTime(times[0]);
    }

    const handleLastTS = () => {
        if (times.length > 0) {
            setSelectedTime(times[times.length - 1]);
        }
    }


    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateForAPI = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const getTimesFunction = async () => {
            try {
                const formattedDate = formatDateForAPI(selectedDate);
                const res = await fetch(`${baseURL}/times?date=${formattedDate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await res.json();
                if (res.status === 200) {
                    setTimes(data.data);
                    // Set first time as default if available
                    if (data.data.length > 0) {
                        setSelectedTime(data.data[0]);
                    }
                }
            } catch (error) {
                console.log('Error fetching times:', error);
            }
        }

        if (selectedDate) {
            getTimesFunction();
        }
    }, [selectedDate]);

    return (
        <div className="bg-white w-full border-b border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold">NIFTY Options Dashboard</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Live
                    </Badge>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                        <div className="text-xs text-slate-500">ATM IV</div>
                        <div className="font-bold text-blue-600">12.3</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500">Spot</div>
                        <div className="font-bold text-blue-600">56754.70</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500">Straddle Prem</div>
                        <div className="font-bold text-blue-600">1320</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500">Max Pain</div>
                        <div className="font-bold text-blue-600">57000</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center gap-8">
                {/* Date Calendar */}
                <div className="flex justify-center items-center gap-1">
                    <div>
                        <Button variant="outline" onClick={handlePrevDay}><ChevronLeft /><span>Prev</span></Button>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {formatDate(selectedDate)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                required={true}
                                defaultMonth={new Date(2021, 0)}
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                captionLayout="dropdown"
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <div>
                        <Button variant="outline" onClick={handleNextDay}><span>Next</span><ChevronRight /></Button>
                    </div>
                </div>
                {/* Time Dropdown */}
                <div className="flex justify-center items-center gap-1">
                    <div>
                        <Button variant="outline" onClick={handleFirstTS}><ChevronFirst /><span>SOD</span></Button>
                    </div>
                    <div>
                        <Button variant="outline" onClick={handlePrevTS}><ChevronLeft /><span>Prev</span></Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                                {selectedTime}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-32">
                            {times.length > 0 ? (
                                times.map((tf, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => setSelectedTime(tf)}
                                        className={`cursor-pointer ${tf === selectedTime
                                            ? 'bg-gray-100 text-gray-900 font-medium'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {tf}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem disabled>
                                    No times available
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                        <Button variant="outline" onClick={handleNextTS}><span>Next</span><ChevronRight /></Button>
                    </div>
                    <div>
                        <Button variant="outline" onClick={handleLastTS}><span>EOD</span><ChevronLast /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}