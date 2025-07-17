import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Loader } from "lucide-react";
import { Label } from "./ui/label";
import type { OptionSide } from "@/lib/PositionType";


interface OptionParams {
    date: Date,
    time: string,
    onAddPosition: (strike: number,
        side: OptionSide,
        type: 'call' | 'put',
        ltp: number,
        expiry: string) => void,
    selectedExpiry: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bulkData: any;
    setExpiry: Dispatch<SetStateAction<string | undefined>>,
}

export interface ChainRow {
    strike: number;
    call_ltp: number;
    put_ltp: number;
}

export interface SnapshotMeta {
    dayOpen: number;
    spot: number;
    atm_iv: number;
    fut_price: number;
}


export function OptionsChain({ date, time, onAddPosition, bulkData, selectedExpiry, setExpiry }: OptionParams) {
    const [loading, setLoading] = useState<boolean>(false);

    const formatDateForAPI = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    let currentData = null, expiryDates = null;

    if (
        bulkData &&
        bulkData[formatDateForAPI(date)] &&
        bulkData[formatDateForAPI(date)][time]
    ) {
        const timeData = bulkData[formatDateForAPI(date)][time];
        expiryDates = Object.keys(timeData);
        expiryDates.sort();
        console.log(expiryDates);

        if (timeData[selectedExpiry]) {
            currentData = timeData[selectedExpiry];

        } else {
            currentData = null;
        }
        console.log(currentData);
    }

    useEffect(() => {
        const formattedDate = formatDateForAPI(date);
        const timeData = bulkData?.[formattedDate]?.[time];

        if (timeData) {
            const expiries = Object.keys(timeData).sort();

            if (!timeData[selectedExpiry] && expiries.length > 0) {
                setExpiry(expiries[0]);
            }
        }
    }, [bulkData, date, time]);


    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // useEffect(() => {
    //     const getExpiriesFunction = async () => {
    //         setLoading(true);
    //         try {
    //             const formattedDate = formatDateForAPI(date);
    //             const res = await fetch(`${baseURL}/expiry-dates?date=${formattedDate}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //             });
    //             const data = await res.json();
    //             if (res.status === 200) {
    //                 setExpiryDates(data.data);
    //                 setExpiry(data.data[0])
    //             } else if (res.status === 500) {
    //                 setExpiryDates([]);
    //                 setExpiry('');
    //             } else {
    //                 setExpiry('');
    //                 console.error('Unexpected response status:', res.status);
    //             }

    //         } catch (error) {
    //             console.log('Error fetching times:', error);
    //             setExpiryDates([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     getExpiriesFunction();

    // }, [date])

    // useEffect(() => {
    //     const getOptionsFunction = async () => {
    //         setLoading(true);
    //         try {
    //             const formattedDate = formatDateForAPI(date);
    //             const res = await fetch(`${baseURL}/option-chains?date=${formattedDate}&time=${time}&expiry=${selectedExpiry}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 cache: 'no-cache'
    //             });
    //             const data = await res.json();
    //             if (res.status === 200) {
    //                 setOptionsData(data.chain);
    //             } else if (res.status === 500) {
    //                 setOptionsData([]);
    //             } else {
    //                 setOptionsData([]);
    //                 console.error('Unexpected response status:', res.status);
    //             }

    //         } catch (error) {
    //             console.log('Error fetching times:', error);
    //             setOptionsData([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     if (selectedExpiry) getOptionsFunction();
    // }, [date, time, selectedExpiry]);

    // if (loading) {
    //     <Card className="h-full">
    //         <CardContent>
    //             <div className="flex justify-center items-center h-full">
    //                 <Loader className="w-6 h-6 animate-spin text-blue-600" />
    //             </div>
    //         </CardContent>
    //     </Card>
    // }

    return (
        <Card className="h-full">
            <CardHeader className="">
                <CardTitle className="text-xl text-left mt-1">Option Chain</CardTitle>
                <div className="flex w-full items-center justify-center gap-3">
                    {expiryDates && expiryDates.map(exp => {
                        const isActive = exp === selectedExpiry;
                        return (
                            <Button
                                key={exp}
                                variant={isActive ? 'default' : 'outline'}
                                className={`text-sm px-4 py-1 transition
                      ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setExpiry(exp)}
                            >
                                {formatDate(new Date(exp))}
                            </Button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="h-full overflow-hidden">
                <div className="rounded-lg border bg-muted/20 h-full overflow-y-auto hide-scrollbar">
                    <Table>
                        <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow className="border-b">
                                <TableHead className="text-center bg-green-50 text-green-700 font-semibold w-1/5">Call LTP (Δ)</TableHead>
                                <TableHead className="text-center bg-blue-50 text-blue-700 w-1/5">Call Actions</TableHead>
                                <TableHead className="text-center bg-slate-100 font-bold w-1/5">Strike</TableHead>
                                <TableHead className="text-center bg-blue-50 text-blue-700 w-1/5">Put Actions</TableHead>
                                <TableHead className="text-center bg-red-50 text-red-700 font-semibold w-1/5">Put LTP (Δ)</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex justify-center items-center h-full">
                                            <Loader className="w-6 h-6 animate-spin text-blue-600" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : !currentData?.chain.length ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex justify-center items-center h-full">
                                            <Label className="text-gray-500">No Data Available</Label>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {currentData.chain.map((row: { strike: number, call_ltp: number, put_ltp: number }) => (
                                    <TableRow
                                        key={row.strike}
                                        className={`hover:bg-muted/50 py-4 transition-colors ${row.strike === 56700 ? 'bg-blue-50/50 border-blue-200' : ''
                                            }`}
                                    >
                                        <TableCell className="text-center font-medium text-green-600 w-1/5">
                                            {row.call_ltp}
                                        </TableCell>
                                        <TableCell className="text-center w-1/5">
                                            <div className="flex gap-1 justify-center">
                                                <Button onClick={() => {
                                                    onAddPosition(row.strike, 'BUY', 'call', row.call_ltp, selectedExpiry!);


                                                }
                                                } size="sm" variant="outline" className="h-6 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                                                    B
                                                </Button>
                                                <Button onClick={() => {
                                                    onAddPosition(row.strike, 'SELL', 'call', row.call_ltp, selectedExpiry!);
                                                }
                                                } size="sm" variant="outline" className="h-6 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                                                    S
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold bg-slate-50 w-1/5">
                                            {row.strike.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center w-1/5">
                                            <div className="flex gap-1 justify-center">
                                                <Button onClick={() => {
                                                    onAddPosition(row.strike, 'BUY', 'put', row.put_ltp, selectedExpiry!);
                                                }
                                                } size="sm" variant="outline" className="h-6 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                                                    B
                                                </Button>
                                                <Button onClick={() => {
                                                    onAddPosition(row.strike, 'SELL', 'put', row.put_ltp, selectedExpiry!);
                                                }
                                                } size="sm" variant="outline" className="h-6 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                                                    S
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-red-600 w-1/5">
                                            {row.put_ltp}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}