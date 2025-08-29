// src/types/index.ts

export interface Stock {
  symbol: string;
  change: number; // Percentage change
  history: number[];
  prev_day_close?: number;  // Array of numbers for sparkline
  // Add any other properties your stock objects might have
}

export type SortKey = 'symbol' | 'change';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  order: SortOrder;
}