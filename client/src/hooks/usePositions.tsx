import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { OptionSide, PositionRow } from '@/lib/PositionType';

const LOT_SIZE = 35;

export const usePositions = () => {
    const [positions, setPositions] = useState<PositionRow[]>([]);

    const addPosition = (
        strike: number,
        side: OptionSide,
        ltp: number,
        expiry: string
    ) => {
        setPositions(prev => {
            const nextLotNo = prev.length + 1;

            const qty = side === 'BUY' ? LOT_SIZE : -LOT_SIZE;

            const newRow: PositionRow = {
                id: nanoid(),
                lotNo: nextLotNo,
                qty,
                strike,
                side,
                expiry: expiry,
                entry: ltp,
                ltp,
                delta: 0,
                pnlAbs: 0,
                pnlPct: 0,
                lotsExit: Math.abs(qty / LOT_SIZE),
                selected: true
            };

            return [...prev, newRow];
        });
    };

    return { positions, addPosition };
};
