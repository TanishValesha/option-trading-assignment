import {
    ResizableHandle, ResizablePanel, ResizablePanelGroup
} from '@/components/ui/resizable';
import { OptionsChain } from './OptionsChain';
import { PayoffChart } from './PayoffChart';
import { PositionsPanel } from './PositionsPanel';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { OptionSide, PositionRow } from '@/lib/PositionType';
import { nanoid } from 'nanoid';
import { baseURL } from '@/lib/baseURL';
import { Loader } from 'lucide-react';
import type { BulkData } from '@/lib/BulkDataType';

interface Meta {
    dayOpen: number;
    spot: number;
    atm_iv: number;
    fut_price: number;
}


interface LayoutParams {
    date: Date;
    time: string;
    meta: Meta;
    setMeta: Dispatch<SetStateAction<Meta>>;
    theme?: 'light' | 'dark';
}



export function ResizableLayout({ date, time, setMeta, meta, theme }: LayoutParams) {
    const [positions, setPositions] = useState<PositionRow[]>([]);
    const [selectedExpiry, setExpiry] = useState<string | undefined>('2021-01-07');
    const [bulkData, setBulkData] = useState<BulkData | undefined>();
    const [loading, setLoading] = useState(false);

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day;
    };


    const formatDateForAPI = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        console.log("Cached");
        if (isWeekend(date) === 6) {
            date.setDate(date.getDate() + 2);
            return;
        } else if (isWeekend(date) === 0) {
            date.setDate(date.getDate() + 1);
            return;
        }
        const selected = formatDateForAPI(date);
        if (bulkData && bulkData[selected]) return;

        const fetchAndStore = async () => {
            setLoading(true);
            console.log("Trigerred");
            try {
                const res = await fetch(`${baseURL}/bulk?date=${selected}`);
                const data = await res.json();
                setBulkData(prev => ({
                    ...prev,
                    ...data,
                }));

            } catch (err) {
                console.error(`Error fetching future date ${selected}`, err);
            } finally {
                setLoading(false);
            }
        };



        fetchAndStore();
        // if (bulkData) {
        //     const dayData = bulkData?.[formatDateForAPI(date)]?.[time]?.[selectedExpiry];
        //     console.log(dayData);
        //     setMeta(dayData?.meta?.spot ?? 0);
        // }

    }, [date]);

    useEffect(() => {
        const updatePositionsFromBulkData = () => {
            const formattedDate = formatDateForAPI(date);
            let dayData;
            if (selectedExpiry) {
                dayData = bulkData?.[formattedDate]?.[time]?.[selectedExpiry];
            }

            if (!dayData || !dayData.chain || !dayData.meta) {
                console.warn("No data found in bulkData for current date/time/expiry");
                return;
            }
            setMeta(dayData.meta);

            setPositions(prev =>
                prev.map(pos => {
                    const match = dayData.chain.find((opt: { strike: number, call_ltp: number, put_ltp: number }) => opt.strike === pos.strike);
                    if (!match) return pos;

                    const latestLTP = pos.type === 'call' ? match.call_ltp : match.put_ltp;
                    const optionSide = pos.side === 'BUY';

                    const entry = pos.entry;
                    const qty = pos.qty;

                    const pnlAbs = optionSide
                        ? (latestLTP - entry) * qty
                        : (entry - latestLTP) * qty;

                    const pnlPct = optionSide
                        ? ((latestLTP - entry) / entry) * 100
                        : ((entry - latestLTP) / entry) * 100;

                    return {
                        ...pos,
                        ltp: latestLTP,
                        pnlAbs: Number(pnlAbs.toFixed(2)),
                        pnlPct: Number(pnlPct.toFixed(2)),
                        delta: 0
                    };
                })
            );
        };

        updatePositionsFromBulkData();
    }, [date, time, selectedExpiry, bulkData]);



    const addPosition = (
        strike: number,
        side: OptionSide,
        type: 'call' | 'put',
        ltp: number,
        expiry: string
    ) => {
        setPositions(prev => {
            const LOT_SIZE = 35;
            const lotQty = LOT_SIZE;

            const index = prev.findIndex(
                r => r.strike === strike && r.side === side && r.expiry === expiry && r.type === type
            );

            if (index !== -1) {
                const updated = [...prev];
                const row = updated[index];

                row.qty += lotQty;
                row.lotsExit = Math.abs(row.qty / LOT_SIZE);
                row.ltp = ltp;
                return updated;
            }


            const newRow: PositionRow = {
                id: nanoid(),
                lotNo: prev.length + 1,
                qty: lotQty,
                strike,
                side,
                type: type,
                expiry,
                entry: ltp,
                ltp,
                delta: 0,
                pnlAbs: 0,
                pnlPct: 0,
                lotsExit: 1,
                selected: true
            };

            return [...prev, newRow];
        });
    };

    return (
        <div className="h-[calc(100vh-120px)] w-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={45} minSize={35}>
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader className="w-6 h-6 animate-spin text-blue-600 dark:text-white" />
                            </div>
                        ) : (
                            <OptionsChain
                                date={date}
                                time={time}
                                theme={theme}
                                positions={positions}
                                bulkData={bulkData}
                                onAddPosition={addPosition}
                                selectedExpiry={selectedExpiry!}
                                setExpiry={setExpiry}
                            />
                        )}
                    </>

                </ResizablePanel>
                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={55} minSize={30}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50} minSize={20}>
                            <PayoffChart positions={positions} spotPrice={meta.spot} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={45} minSize={25}>
                            <PositionsPanel
                                positions={positions}
                                setPositions={setPositions}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
