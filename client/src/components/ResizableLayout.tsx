import {
    ResizableHandle, ResizablePanel, ResizablePanelGroup
} from '@/components/ui/resizable';
import { OptionsChain } from './OptionsChain';
import { PayoffChart } from './PayoffChart';
import { PositionsPanel } from './PositionsPanel';
import { useEffect, useState } from 'react';
import type { OptionSide, PositionRow } from '@/lib/PositionType';
import { nanoid } from 'nanoid';
import { baseURL } from '@/lib/baseURL';

interface LayoutParams {
    date: Date;
    time: string;
}

interface Meta {
    dayOpen: number,
    spot: number,
    atm_iv: number,
    fut_price: number
}


export function ResizableLayout({ date, time }: LayoutParams) {
    const [meta, setMeta] = useState<Meta>();
    const [positions, setPositions] = useState<PositionRow[]>([]);
    const [selectedExpiry, setExpiry] = useState<string>();

    useEffect(() => {
        const updatePositions = async () => {
            if (!positions.length) return;

            const formatDateForAPI = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const res = await fetch(
                `${baseURL}/option-chains?date=${formatDateForAPI(date)}&time=${time}&expiry=${positions[0]?.expiry}`
            );
            const data = await res.json();
            setMeta(data.meta);
            if (!data.chain || !data.meta) return;

            setPositions(prev =>
                prev.map(pos => {
                    const match = data.chain.find((opt: any) => opt.strike === pos.strike);
                    if (!match) return pos;

                    const latestLTP = pos.type === 'call' ? match.call_ltp : match.put_ltp;
                    const optionSide = pos.side === 'BUY' ? true : false;

                    const qty = pos.qty;
                    const entry = pos.entry;
                    let pnlAbs, pnlPct;
                    if (optionSide) {
                        pnlAbs = (latestLTP - entry) * qty;
                        pnlPct = ((latestLTP - entry) / entry) * 100;
                    } else {
                        pnlAbs = (entry - latestLTP) * qty;
                        pnlPct = ((entry - latestLTP) / entry) * 100;
                    }

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

        updatePositions();
    }, [date, time, selectedExpiry]);

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
                    <OptionsChain
                        date={date}
                        time={time}
                        onAddPosition={addPosition}
                        selectedExpiry={selectedExpiry!}
                        setExpiry={setExpiry}

                    />
                </ResizablePanel>
                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={55} minSize={30}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={35} minSize={20}>
                            <PayoffChart positions={positions} spotPrice={meta?.spot ?? 0} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={35} minSize={25}>
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
