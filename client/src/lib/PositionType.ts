export type OptionSide = 'BUY' | 'SELL';

export interface PositionRow {
  id: string;
  lotNo: number;
  qty: number;
  strike: number;
  side: OptionSide;
  type: 'call' | 'put';
  expiry: string;
  entry: number;
  ltp: number;
  delta: number;
  pnlAbs: number;
  pnlPct: number;
  lotsExit: number;
  selected: boolean;
}
