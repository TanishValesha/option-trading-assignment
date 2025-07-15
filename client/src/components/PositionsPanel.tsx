import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings, Share, Trash2 } from "lucide-react";

export function PositionsPanel() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Positions</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Notes
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                            <Settings className="w-3 h-3 mr-1" />
                            Add Adj
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Lots</TableHead>
                                <TableHead className="text-xs">Qty</TableHead>
                                <TableHead className="text-xs">Strike</TableHead>
                                <TableHead className="text-xs">Expiry</TableHead>
                                <TableHead className="text-xs">Entry</TableHead>
                                <TableHead className="text-xs">LTP</TableHead>
                                <TableHead className="text-xs">Delta</TableHead>
                                <TableHead className="text-xs">P&L</TableHead>
                                <TableHead className="text-xs">Lots Exit</TableHead>
                                <TableHead className="text-xs">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-slate-500 py-8">
                                    No positions currently open
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <span className="text-sm text-slate-600">Delta:</span>
                            <span className="ml-2 font-semibold">0.00</span>
                        </div>
                        <div>
                            <span className="text-sm text-slate-600">P&L:</span>
                            <span className="ml-2 font-semibold text-slate-600">₹0.00 (0%)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="multiplier" className="text-sm">Multiplier:</Label>
                            <Input id="multiplier" type="number" value="1" className="w-16 h-8" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="lotsize" className="text-sm">Lot Size:</Label>
                            <span className="text-sm font-medium">35</span>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                                Add Alert
                            </Button>
                            <Button size="sm" variant="outline" className="h-8">
                                Save
                            </Button>
                            <Button size="sm" variant="outline" className="h-8">
                                <Share className="w-3 h-3 mr-1" />
                                Share
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700">
                                <Trash2 className="w-3 h-3" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}