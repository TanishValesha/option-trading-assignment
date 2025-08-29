import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronDown, CalendarIcon, ChevronRight, ChevronLeft, ChevronFirst, ChevronLast, Moon, Sun, UserRound, LogOutIcon, Loader } from "lucide-react";
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
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Meta {
    dayOpen: number;
    spot: number;
    atm_iv: number;
    fut_price: number;
}

interface HeaderParams {
    selectedDate: Date;
    selectedTime: string;
    setSelectedDate: (d: Date) => void;
    setSelectedTime: (t: string) => void;
    meta: Meta;
    isDisable?: boolean;
    setIsDisable?: (d: boolean) => void;
}

export function MarketHeader({ selectedDate, selectedTime, setSelectedDate, setSelectedTime, meta, isDisable }: HeaderParams) {
    const [times, setTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleDisabledCalendar = () => {
        toast.error("Check Positions");
    }

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

    const handleDisabledNextDayClick = () => {
        toast.error("Check Positions");
    }

    const handlePrevTS = () => {
        const currentIndex = times.indexOf(selectedTime);

        if (currentIndex === 0) {
            handlePrevDay();
            setTimeout(() => {
                if (times.length > 0) {
                    setSelectedTime(times[times.length - 1]);
                }
            }, 0);
        } else if (currentIndex > 0) {
            setSelectedTime(times[currentIndex - 1]);
        }
    };

    const handleDisabledNextTSClick = () => {
        toast.error("Check Positions");
    }


    const handleNextTS = () => {
        const len = times.length;
        const currentIndex = times.indexOf(selectedTime);

        if (currentIndex === len - 1) {
            handleNextDay();
            setTimeout(() => {
                if (times.length > 0) setSelectedTime(times[0]);
            }, 0);
        } else if (currentIndex < len - 1) {
            setSelectedTime(times[currentIndex + 1]);
        }
    };


    const authToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };



    useEffect(() => {
        const getTimesFunction = async () => {
            try {
                const formattedDate = formatDateForAPI(selectedDate);
                const res = await fetch(`${baseURL}/times?date=${formattedDate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await authToken()}`,
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
        <div className={`w-full border-b p-4 transition-colors duration-300 ${theme === 'dark'
            ? 'bg-black border-gray-700'
            : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`} />
                        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            NIFTY Options Dashboard
                        </span>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`
                            hover:scale-105 hover:shadow-lg
                            relative inline-flex items-center justify-center
                            w-10 h-10 rounded-xl
                            transition-all duration-300 ease-in-out
                            ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            }
                            border shadow-lg hover:shadow-xl
                        `}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        {/* Sun icon */}
                        <Sun
                            className={`
                                absolute w-4 h-4
                                transition-all duration-500 ease-in-out
                                ${theme === 'dark'
                                    ? 'scale-0 rotate-90 opacity-0 text-gray-400'
                                    : 'scale-100 rotate-0 opacity-100 text-gray-700'
                                }
                            `}
                        />

                        {/* Moon icon */}
                        <Moon
                            className={`
                                absolute w-4 h-4
                                transition-all duration-500 ease-in-out
                                ${theme === 'dark'
                                    ? 'scale-100 rotate-0 opacity-100 text-gray-200'
                                    : 'scale-0 -rotate-90 opacity-0 text-gray-400'
                                }
                            `}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                ATM IV
                            </div>
                            <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                {meta.atm_iv == 0 ? '-' : meta.atm_iv}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                Spot
                            </div>
                            <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                {meta.spot == 0 ? '-' : meta.spot}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                Day Open
                            </div>
                            <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                {meta.dayOpen == 0 ? '-' : meta.dayOpen}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                Future Prices
                            </div>
                            <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                {meta.fut_price == 0 ? '-' : meta.fut_price}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => {
                                navigate("/profile")
                            }}
                            className={`hover:scale-105
                            hover:shadow-lg
                            relative inline-flex items-center justify-center
                            w-10 h-10 rounded-xl
                            transition-all duration-300 ease-in-out
                            ${theme === 'dark'
                                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                }
                            border shadow-lg hover:shadow-xl
                        `}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        >
                            <UserRound className="w-4 h-4" />

                        </button>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                const res = await fetch(`${baseURL}/user/logout`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                });

                                await supabase.auth.signOut();

                                if (res.status === 200) {
                                    navigate("/");
                                    toast.success("Logged out successfully");
                                } else {
                                    toast.error("Failed to log out");
                                }
                                setLoading(false);
                            }}
                            className={`hover:scale-105
                            hover:shadow-lg
                            relative inline-flex items-center justify-center
                            w-10 h-10 rounded-xl
                            transition-all duration-300 ease-in-out
                            ${theme === 'dark'
                                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                }
                            border shadow-lg hover:shadow-xl
                        `}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <LogOutIcon className="w-4 h-4" />}

                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center gap-8">
                {/* Date Calendar */}
                <div className="flex justify-center items-center gap-1">
                    <div>
                        <Button
                            variant="outline"
                            onClick={handlePrevDay}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:text-white'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                }`}
                        >
                            <ChevronLeft />
                            <span>Prev</span>
                        </Button>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 px-3 gap-2 ${theme === 'dark'
                                    ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                    }`}
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {formatDate(selectedDate)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`} align="start">
                            <Calendar
                                mode="single"
                                required={true}
                                defaultMonth={new Date(2021, 0, 1)}
                                selected={selectedDate}
                                onSelect={isDisable ? handleDisabledCalendar : setSelectedDate}
                                captionLayout="dropdown"
                                className={theme === 'dark' ? 'text-white !bg-[#1F1F1F]' : ''}
                            />
                        </PopoverContent>
                    </Popover>
                    <div>
                        <Button
                            variant="outline"
                            onClick={isDisable ? handleDisabledNextDayClick : handleNextDay}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                } ${isDisable ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            aria-disabled={isDisable}
                        >
                            <span>Next</span>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                {/* Time Dropdown */}
                <div className="flex justify-center items-center gap-1">
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleFirstTS}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                }`}
                        >
                            <ChevronFirst />
                            <span>SOD</span>
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            onClick={handlePrevTS}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                }`}
                        >
                            <ChevronLeft />
                            <span>Prev</span>
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 px-3 gap-2 ${theme === 'dark'
                                    ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                    }`}
                            >
                                {selectedTime}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className={`w-32 ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            {times.length > 0 ? (
                                times.map((tf, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => setSelectedTime(tf)}
                                        className={`cursor-pointer ${tf === selectedTime
                                            ? theme === 'dark'
                                                ? 'bg-gray-700 text-gray-100 font-medium'
                                                : 'bg-gray-100 text-gray-900 font-medium'
                                            : theme === 'dark'
                                                ? 'text-gray-200 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tf}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem
                                    disabled
                                    className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                >
                                    No times available
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                        <Button
                            variant="outline"
                            // Remove the `disabled` attribute
                            // disabled={isDisable && times.indexOf(selectedTime) === times.length - 1}

                            // Conditionally call the appropriate handler
                            onClick={times.indexOf(selectedTime) === times.length - 1 ? handleDisabledNextTSClick : handleNextTS}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                } ${times.indexOf(selectedTime) === times.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            aria-disabled={times.indexOf(selectedTime) === times.length - 1}
                        >
                            <span>Next</span>
                            <ChevronRight />
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleLastTS}
                            className={`${theme === 'dark'
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg'
                                }`}
                        >
                            <span>EOD</span>
                            <ChevronLast />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}