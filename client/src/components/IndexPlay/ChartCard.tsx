import React from 'react';

interface ChartCardProps {
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ children }) => {
    return (
        <div className="chart-card">
            {children}
        </div>
    );
};

export default ChartCard;