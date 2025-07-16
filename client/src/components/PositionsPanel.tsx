import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { PositionRow } from '@/lib/PositionType';
import type { SetStateAction } from 'react';

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

    const deleteRow = (id: string) =>
        setPositions(prev => prev.filter(p => p.id !== id));

    const clearAll = () => setPositions([]);

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Positions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[
                                    'Sr.No', 'Qty', 'Strike', 'Expiry', 'Entry',
                                    'LTP', 'Delta', 'P&L', 'Lots', 'Actions'
                                ].map(h => (
                                    <TableHead key={h} className="text-xs text-center">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className='text-center'>
                            {positions.length ? (
                                positions.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.lotNo}</TableCell>
                                        <TableCell>{p.qty}</TableCell>
                                        <TableCell>{p.strike} ({p.type === 'call' ? "CALL" : "PUT"})</TableCell>
                                        <TableCell>{fmtDate(p.expiry)}</TableCell>
                                        <TableCell>{p.entry.toFixed(2)}</TableCell>
                                        <TableCell>{p.ltp.toFixed(2)}</TableCell>
                                        <TableCell>{p.delta.toFixed(2)}</TableCell>
                                        <TableCell
                                            className={clsx(
                                                p.pnlAbs > 0 && 'text-green-600',
                                                p.pnlAbs < 0 && 'text-red-600'
                                            )}
                                        >
                                            ₹{p.pnlAbs.toFixed(2)} ({p.pnlPct.toFixed(1)}%)
                                        </TableCell>
                                        <TableCell>{p.qty / 35}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-6 px-2"
                                                onClick={() => deleteRow(p.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                                        No positions currently open
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>


                <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                        <div>
                            <span className="text-sm text-slate-600">P&L:</span>
                            <span
                                className={clsx(
                                    'ml-2 font-semibold',
                                    totals.pnlAbs > 0 && 'text-green-600',
                                    totals.pnlAbs < 0 && 'text-red-600'
                                )}
                            >
                                ₹{totals.pnlAbs.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="destructive"
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
