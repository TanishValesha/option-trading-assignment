import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { PositionRow } from '@/lib/PositionType';
import type { SetStateAction } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface PositionParams {
    positions: PositionRow[];
    setPositions: React.Dispatch<SetStateAction<PositionRow[]>>;
}

const LOT_SIZE = 35;
const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });


export function PositionsPanel({ positions, setPositions }: PositionParams) {

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

    const clearAll = () => setPositions([]);

    return (
        <Card className={clsx(
            "h-full",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
            <CardHeader className="pb-4">
                <CardTitle className={clsx(
                    "text-lg font-medium",
                    isDark ? "text-gray-100" : "text-gray-900"
                )}>Positions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className={clsx(
                                isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                            )}>
                                {[
                                    'Sr.No', 'Qty', 'Strike', 'Expiry', 'Entry',
                                    'LTP', 'Delta', 'P&L', 'Lots', 'Actions'
                                ].map(h => (
                                    <TableHead key={h} className={clsx(
                                        "text-xs text-center font-medium",
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
                                        <TableCell className={isDark ? "text-gray-200" : "text-gray-900"}>{p.qty / 35}</TableCell>
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
                    "border-t pt-4",
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
                        variant="destructive"
                        className={clsx(
                            isDark
                                ? "bg-red-600 hover:bg-red-700 text-white border-red-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-600"
                                : "bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        )}
                        onClick={clearAll}
                        disabled={!positions.length}
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}