// components/NavigationTabs.tsx

import React from 'react';
import { Button } from '../ui/button';


// Define the interface for the NavigationTabs component's props
export interface NavigationTabsProps {
    tabs: {
        icon: React.ElementType; // Type for a React component (like a Lucide icon)
        label: string;
    }[];
    activeTab: string; // This prop isn't currently used in the component logic, but kept for type consistency
}

// Navigation Tabs Component as a functional component with TypeScript props
const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, }) => {
    return (
        <div className="bg-pink-100 px-6 pb-1">
            <div className="flex gap-8 text-sm border-b border-gray-300">
                {tabs.map((tab, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="flex items-center gap-2 py-3 px-1 h-auto text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-400 rounded-none"
                    // You might want to add conditional styling based on activeTab here if you use it
                    // e.g., ${tab.label === activeTab ? 'border-blue-600 text-blue-600' : ''}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default NavigationTabs;
