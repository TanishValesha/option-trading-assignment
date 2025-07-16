import {
    ResizableHandle, ResizablePanel, ResizablePanelGroup
} from '@/components/ui/resizable';
import { OptionsChain } from './OptionsChain';
import { PayoffChart } from './PayoffChart';
import { PositionsPanel } from './PositionsPanel';
import { useState } from 'react';
import type { OptionSide, PositionRow } from '@/lib/PositionType';
import { nanoid } from 'nanoid';

interface LayoutParams {
    date: Date;
    time: string;
}


export function ResizableLayout({ date, time }: LayoutParams) {
    const [positions, setPositions] = useState<PositionRow[]>([]);

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
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={55} minSize={30}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={35} minSize={20}>
                            <PayoffChart />
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
