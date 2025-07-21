import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import clsx from 'clsx';
import type { PositionRow } from '@/lib/PositionType';
import type { SetStateAction } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';

interface PositionParams {
    date: Date;
    positions: PositionRow[];
    setPositions: React.Dispatch<SetStateAction<PositionRow[]>>;
}

const LOT_SIZE = 35;
const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });


export function PositionsPanel({ positions, setPositions, date }: PositionParams) {

    const totals = positions.reduce(
        (acc, p) => {
            acc.delta += p.delta * (p.qty / LOT_SIZE);
            acc.pnlAbs += p.pnlAbs;
            return acc;
        },
        { delta: 0, pnlAbs: 0 }
    );
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const deleteRow = (id: string) =>
        setPositions(prev => prev.filter(p => p.id !== id));

    const authToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }



    const saveClearAll = () => {
        if (positions.length === 0) return;

        const payload = positions.map(p => ({
            ...p,
            lotNo: p.lotNo,
            qty: p.qty,
            entry: p.entry.toFixed(2),
            ltp: p.ltp.toFixed(2),
            pnlAbs: p.pnlAbs.toFixed(2),
            pnlPct: p.pnlPct.toFixed(2),
            end_date: date,
        }));

        console.log(payload);


        const savePositions = async () => {
            fetch('http://localhost:3000/api/save/positions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authToken()}`,
                },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Positions saved:', data);
                    setPositions([]);
                })
                .catch(error => {
                    console.error('Error saving positions:', error);
                });
        }

        savePositions();


    }

    const updateQty = (id: string, change: number) => {
        setPositions(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const newQty = Math.max(LOT_SIZE, p.qty + change * LOT_SIZE);
                    let newPnlAbs = 0;
                    let newPnlPct = 0;

                    if (p.side === 'BUY') {
                        newPnlAbs = (p.ltp - p.entry) * newQty;
                    } else {
                        newPnlAbs = (p.entry - p.ltp) * newQty;
                    }

                    // Ensure division by zero is handled if entry * newQty is 0
                    newPnlPct = (p.entry * newQty) !== 0 ? (newPnlAbs / (p.entry * newQty)) * 100 : 0;

                    return {
                        ...p,
                        qty: newQty,
                        pnlAbs: newPnlAbs,
                        pnlPct: newPnlPct
                    };
                }
                return p;
            })
        );
    };

    return (
        <Card className={clsx(
            "h-full flex flex-col",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
            <CardHeader className='-mt-2'>
                <CardTitle className={clsx(
                    "text-lg font-medium",
                    isDark ? "text-gray-100" : "text-gray-900"
                )}>Positions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col overflow-hidden -mt-6">
                <div className="flex-grow overflow-y-auto overflow-x-auto hide-scrollbar">
                    <Table>
                        <TableHeader className="sticky top-0 bg-inherit z-10 ">
                            <TableRow className={clsx(
                                isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                            )}>
                                {[
                                    'Sr.No', 'Qty', 'Strike', 'Expiry', 'Entry',
                                    'LTP', 'Delta', 'P&L', 'Lots', 'Actions'
                                ].map(h => (
                                    <TableHead key={h} className={clsx(
                                        "text-xs text-center font-medium min-w-[70px]",
                                        isDark ? "text-gray-300" : "text-gray-700"
                                    )}>{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className='text-center'>
                            {positions.length ? (
                                positions.map(p => (
                                    <TableRow key={p.id} className={clsx(
                                        isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                                    )}>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.lotNo}</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.qty}</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.strike} ({p.type === 'call' ? "CALL" : "PUT"})</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{fmtDate(p.expiry)}</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.entry.toFixed(2)}</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.ltp.toFixed(2)}</TableCell>
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.delta.toFixed(2)}</TableCell>
                                        <TableCell
                                            className={clsx(
                                                'font-medium',
                                                p.pnlAbs > 0 && (isDark ? 'text-green-400' : 'text-green-600'),
                                                p.pnlAbs < 0 && (isDark ? 'text-red-400' : 'text-red-600'),
                                                p.pnlAbs === 0 && (isDark ? 'text-gray-200' : 'text-gray-900')
                                            )}
                                        >
                                            ₹{p.pnlAbs.toFixed(2)} ({p.pnlPct.toFixed(1)}%)
                                        </TableCell>
                                        <TableCell className={clsx("flex items-center justify-center space-x-1", isDark ? "text-gray-200" : "text-gray-900")}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQty(p.id, -1)}
                                                disabled={p.qty <= LOT_SIZE}
                                                className={clsx(
                                                    "h-6",
                                                    isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                                                    p.qty <= LOT_SIZE && (isDark ? "opacity-50 cursor-not-allowed" : "opacity-50 cursor-not-allowed")
                                                )}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span>{p.qty / LOT_SIZE}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQty(p.id, 1)}
                                                className={clsx(
                                                    "h-6 px-1",
                                                    isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                )}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className={clsx(
                                                    "h-6 px-2",
                                                    isDark
                                                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                                        : "bg-red-600 hover:bg-red-700 text-white"
                                                )}
                                                onClick={() => deleteRow(p.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className={isDark ? "border-gray-700" : "border-gray-200"}>
                                    <TableCell colSpan={10} className={clsx(
                                        "text-center py-8",
                                        isDark ? "text-gray-400" : "text-slate-500"
                                    )}>
                                        No positions currently open
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>


                <div className={clsx(
                    "border-t pt-4 mt-auto", // `mt-auto` pushes it to the bottom of the flex container (CardContent)
                    isDark ? "border-gray-700" : "border-gray-200"
                )}>
                    <div className="flex justify-between mb-4">
                        <div>
                            <span className={clsx(
                                "text-sm",
                                isDark ? "text-gray-300" : "text-slate-600"
                            )}>P&L:</span>
                            <span
                                className={clsx(
                                    'ml-2 font-semibold',
                                    totals.pnlAbs > 0 && (isDark ? 'text-green-400' : 'text-green-600'),
                                    totals.pnlAbs < 0 && (isDark ? 'text-red-400' : 'text-red-600'),
                                    totals.pnlAbs === 0 && (isDark ? 'text-gray-200' : 'text-gray-900')
                                )}
                            >
                                ₹{totals.pnlAbs.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className={clsx(

                            "bg-blue-500 hover:bg-blue-700 hover:text-white text-white disabled:bg-gray-300 disabled:text-gray-500"
                        )}
                        onClick={saveClearAll}
                        disabled={!positions.length}
                    >
                        Save and Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}