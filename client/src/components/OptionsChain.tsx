import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OptionRow {
    callLTP: number;
    callIV: number;
    callOI: number;
    strike: number;
    putOI: number;
    putIV: number;
    putLTP: number;
}

const optionsData: OptionRow[] = [
    { callLTP: 1595.6, callIV: 13.9, callOI: 0, strike: 52000, putOI: 0, putIV: 21.8, putLTP: 255.9 },
    { callLTP: 1251.7, callIV: 12.7, callOI: 0, strike: 56100, putOI: 63.9, putIV: 13.9, putLTP: 279.6 },
    { callLTP: 1170.3, callIV: 12.8, callOI: 12.6, strike: 56200, putOI: 99.4, putIV: 13.6, putLTP: 306.1 },
    { callLTP: 1099.0, callIV: 12.6, callOI: 26.4, strike: 56300, putOI: 81.3, putIV: 13.5, putLTP: 333.1 },
    { callLTP: 1035.0, callIV: 12.5, callOI: 2.7, strike: 56400, putOI: 84.8, putIV: 13.4, putLTP: 361.6 },
    { callLTP: 969.7, callIV: 12.4, callOI: 42.3, strike: 56500, putOI: 6.4, putIV: 13.2, putLTP: 393.0 },
    { callLTP: 904.1, callIV: 12.3, callOI: 67.8, strike: 56600, putOI: 1.2, putIV: 13.1, putLTP: 429.9 },
    { callLTP: 840.9, callIV: 12.3, callOI: 91.7, strike: 56700, putOI: 1.7, putIV: 13.0, putLTP: 463.8 },
    { callLTP: 786.3, callIV: 12.3, callOI: 87.4, strike: 56800, putOI: 1.5, putIV: 12.9, putLTP: 502.6 },
    { callLTP: 730.1, callIV: 12.3, callOI: 12.0, strike: 56900, putOI: 1.5, putIV: 12.8, putLTP: 545.9 },
];

export function OptionsChain() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Options Chain</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Expiry: 31 Jul 25</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-muted/20">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b">
                                <TableHead className="text-center bg-green-50 text-green-700 font-semibold">Call LTP (Δ)</TableHead>
                                <TableHead className="text-center bg-green-50 text-green-700">IV</TableHead>
                                <TableHead className="text-center bg-green-50 text-green-700">OI</TableHead>
                                <TableHead className="text-center bg-blue-50 text-blue-700">Call Actions</TableHead>
                                <TableHead className="text-center bg-slate-100 font-bold">Strike</TableHead>
                                <TableHead className="text-center bg-blue-50 text-blue-700">Put Actions</TableHead>
                                <TableHead className="text-center bg-red-50 text-red-700">OI</TableHead>
                                <TableHead className="text-center bg-red-50 text-red-700">IV</TableHead>
                                <TableHead className="text-center bg-red-50 text-red-700 font-semibold">Put LTP (Δ)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {optionsData.map((row,) => (
                                <TableRow
                                    key={row.strike}
                                    className={`hover:bg-muted/50 transition-colors ${row.strike === 56700 ? 'bg-blue-50/50 border-blue-200' : ''
                                        }`}
                                >
                                    <TableCell className="text-center font-medium text-green-600">
                                        {row.callLTP.toFixed(1)}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{row.callIV}</TableCell>
                                    <TableCell className="text-center text-sm">
                                        {row.callOI > 0 ? row.callOI.toFixed(1) : '0'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex gap-1 justify-center">
                                            <Button size="sm" variant="outline" className="h-6 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                                                B
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-6 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                                                S
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold bg-slate-50">
                                        {row.strike.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex gap-1 justify-center">
                                            <Button size="sm" variant="outline" className="h-6 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                                                B
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-6 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                                                S
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {row.putOI > 0 ? row.putOI.toFixed(1) : '0'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{row.putIV}</TableCell>
                                    <TableCell className="text-center font-medium text-red-600">
                                        {row.putLTP.toFixed(1)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}