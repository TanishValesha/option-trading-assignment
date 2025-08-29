// components/BreadcrumbNav.tsx

import React from 'react';
import { Button } from '../ui/button';
// Assuming your Button component is in ui-components

// Define the interface for the BreadcrumbNav component's props
export interface BreadcrumbNavProps {
    items: string[]; // An array of strings for the breadcrumb items
    activeItem: string; // The string representing the currently active item
}

// Breadcrumb Navigation Component as a functional component with TypeScript props
const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, activeItem }) => {
    return (
        <div className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex gap-8 text-sm">
                {items.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className={`h-auto p-0 ${item === activeItem
                            ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-2 rounded-none'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default BreadcrumbNav;
