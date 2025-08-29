// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
    indices: string[];
    selectedIndex: string;
    onIndexChange: (index: string) => void;
}

const Header: React.FC<HeaderProps> = ({ indices, selectedIndex, onIndexChange }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between mb-4">
            <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">Stock Screener</h2>
            <div className="relative">
                <select
                    id="index-filter"
                    className="custom-select control-bg border control-border text-white text-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 pr-10"
                    value={selectedIndex}
                    onChange={(e) => onIndexChange(e.target.value)}
                >
                    {indices.length === 0 ? (
                        <option value="">Loading Indices...</option>
                    ) : (
                        indices.map(index => (
                            <option key={index} value={index}>{index}</option>
                        ))
                    )}
                </select>
            </div>
        </header>
    );
};

export default Header;