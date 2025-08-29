// src/components/Controls.tsx
import React from 'react';
import { Search, List, TrendingUp } from 'lucide-react'; // Using lucide-react for icons
import type { SortState, SortKey } from '../../../types/index'; // Import types
import { Button } from '../ui/button';

interface ControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    currentSort: SortState;
    onSort: (key: SortKey) => void;
}

const Controls: React.FC<ControlsProps> = ({ searchTerm, onSearchChange, currentSort, onSort }) => {
    const isNameSorted = currentSort.key === 'symbol';
    const isPercentSorted = currentSort.key === 'change';

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search by symbol..."
                    className="w-full p-2.5 pl-10 control-bg border control-border text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {/* Sort Buttons */}
            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    className={`p-2.5 control-bg control-border text-white hover:bg-gray-70 hover:border-white hover:text-white hover:scale-105 ${isNameSorted ? 'bg-gray-700' : ''}`}
                    title="Sort by Name"
                    onClick={() => onSort('symbol')}
                >
                    <List className="h-5 w-5" /> {/* Using List icon for name sort */}
                </Button>
                <Button
                    variant="outline"
                    className={`p-2.5 control-bg border control-border text-white hover:text-white hover:scale-105 hover:bg-gray-700  ${isPercentSorted ? 'bg-gray-700' : ''}`}
                    title="Sort by Percentage"
                    onClick={() => onSort('change')}
                >
                    <TrendingUp className="h-5 w-5" /> {/* Using TrendingUp for percentage sort */}
                </Button>
            </div>
        </div>
    );
};

export default Controls;