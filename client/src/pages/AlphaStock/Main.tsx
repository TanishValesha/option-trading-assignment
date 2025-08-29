import BreadcrumbNav from "@/components/AlphaStock/BreadCumberNav";
import CompanyInfo from "@/components/AlphaStock/CompanyInfo";
import CompanyOverview from "@/components/AlphaStock/CompanyOverview";
import CompanyQuality from "@/components/AlphaStock/CompanyQuality";
import BankOfAmericaChart from "@/components/AlphaStock/FaChart";
import Header from "@/components/AlphaStock/Header";
import InsiderTrading from "@/components/AlphaStock/InsiderTrading";
import IntrinsicValueContent from "@/components/AlphaStock/IntrinsicValueContent";
import IntrinsicValueSidebar from "@/components/AlphaStock/IntrinsicValueSidebar";
import InvestorReturns from "@/components/AlphaStock/InvestorReturns";
import NavigationTabs from "@/components/AlphaStock/NavigationTabs";
import ValuationHistoryChart from "@/components/AlphaStock/ValuationHistoryChart";
import WallStEstimates from "@/components/AlphaStock/WallStEstimates";
import { BarChart3, Calculator, DollarSign, FileText, Heart, Settings, TrendingUp, Users } from "lucide-react";
import React, { useState } from 'react';

interface WallStEstimate {
    label: string;
    value: string;
    trend: 'up' | 'down';
    percentage: string;
}

interface InvestorReturn {
    label: string;
    value: string;
    status: 'safe' | 'moderate' | 'high';
}

interface InsiderTradingData {
    period: string;
    months: string;
    value: string;
    trend: 'up' | 'down' | 'none';
    hasBuys: boolean;
}

// Financial Dashboard Interfaces
interface FinancialMetricProps {
    title: string;
    value: string;
    unit: string;
    growth: string;
    data: number[];
    periods?: string[];
    periodGrowth?: string[];
    chartType?: 'bar' | 'line';
}

interface FinancialData {
    value: string;
    unit: string;
    growth: string;
    data: number[];
}

interface DashboardData {
    netInterestIncome: FinancialData;
    nonInterestIncome: FinancialData;
    netIncome: FinancialData;
    eps: FinancialData;
}

interface DashboardDataSet {
    TTM: DashboardData;
    Annual: DashboardData;
    Quarterly: DashboardData;
}

// Financial Dashboard Components
const FinancialMetric: React.FC<FinancialMetricProps> = ({
    title,
    value,
    unit,
    growth,
    data,
    periods = ['3Y', '5Y', '10Y'],
    periodGrowth = ['+23%', '+21%', '+4.3%'],
    chartType = 'bar'
}) => {
    const [, setHoveredBar] = useState<number | null>(null);

    const isPositiveGrowth = growth && growth.startsWith('+');
    const isNegativeGrowth = growth && growth.startsWith('-');

    const maxValue = Math.max(...data);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                        {value}
                        <span className="text-lg text-gray-600">{unit}</span>
                    </span>
                    {growth && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositiveGrowth
                            ? 'bg-green-100 text-green-800'
                            : isNegativeGrowth
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${isPositiveGrowth
                                ? 'bg-green-500'
                                : isNegativeGrowth
                                    ? 'bg-red-500'
                                    : 'bg-gray-500'
                                }`} />
                            {growth}
                        </span>
                    )}
                </div>
            </div>

            <div className="text-sm text-gray-600 font-medium mb-4">{title}</div>

            {chartType === 'bar' ? (
                <div className="flex items-end space-x-1 h-20 mb-4">
                    {data.map((value, index) => (
                        <div
                            key={index}
                            className="flex-1 bg-blue-200 rounded-sm cursor-pointer transition-all duration-200 hover:bg-blue-300"
                            style={{ height: `${(value / maxValue) * 100}%` }}
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-end space-x-0.5 h-20 mb-4">
                    {data.map((value, index) => (
                        <div
                            key={index}
                            className="w-1.5 bg-blue-300 cursor-pointer transition-all duration-200 hover:bg-blue-400"
                            style={{ height: `${(value / maxValue) * 100}%` }}
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                        />
                    ))}
                </div>
            )}

            <div className="flex space-x-4 text-xs text-gray-500">
                {periods.map((period, index) => (
                    <span key={period} className="flex items-center space-x-1">
                        <span>{period}</span>
                        <span className={`${periodGrowth[index]?.startsWith('+') ? 'text-green-600' :
                            periodGrowth[index]?.startsWith('-') ? 'text-red-600' :
                                'text-gray-600'
                            }`}>
                            {periodGrowth[index]}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

const FinancialDashboard: React.FC = () => {
    const [selectedView, setSelectedView] = useState<keyof DashboardDataSet>('TTM');
    const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false);

    // Sample data for different views
    const dashboardData: DashboardDataSet = {
        TTM: {
            netInterestIncome: {
                value: '57.4',
                unit: 'B',
                growth: '+2%',
                data: Array.from({ length: 40 }, () => Math.random() * 100 + 50)
            },
            nonInterestIncome: {
                value: '47.1',
                unit: 'B',
                growth: '+10%',
                data: Array.from({ length: 40 }, () => Math.random() * 90 + 40)
            },
            netIncome: {
                value: '26.6',
                unit: 'B',
                growth: '+1%',
                data: Array.from({ length: 40 }, () => Math.random() * 80 + 30)
            },
            eps: {
                value: '3.47',
                unit: '',
                growth: '+2%',
                data: Array.from({ length: 40 }, () => Math.random() * 70 + 20)
            }
        },
        Annual: {
            netInterestIncome: {
                value: '56.1',
                unit: 'B',
                growth: '-2%',
                data: Array.from({ length: 12 }, () => Math.random() * 100 + 50)
            },
            nonInterestIncome: {
                value: '45.8',
                unit: 'B',
                growth: '+10%',
                data: Array.from({ length: 12 }, () => Math.random() * 90 + 40)
            },
            netIncome: {
                value: '25.5',
                unit: 'B',
                growth: '+3%',
                data: Array.from({ length: 12 }, () => Math.random() * 80 + 30)
            },
            eps: {
                value: '3.21',
                unit: '',
                growth: '+4%',
                data: Array.from({ length: 12 }, () => Math.random() * 70 + 20)
            }
        },
        Quarterly: {
            netInterestIncome: {
                value: '14.7',
                unit: 'B',
                growth: '+2%',
                data: Array.from({ length: 40 }, () => Math.random() * 100 + 50)
            },
            nonInterestIncome: {
                value: '11.8',
                unit: 'B',
                growth: '-7%',
                data: Array.from({ length: 40 }, () => Math.random() * 90 + 40)
            },
            netIncome: {
                value: '6.825',
                unit: 'M',
                growth: '-2%',
                data: Array.from({ length: 40 }, () => Math.random() * 80 + 30)
            },
            eps: {
                value: '0.89',
                unit: '',
                growth: '-1%',
                data: Array.from({ length: 40 }, () => Math.random() * 70 + 20)
            }
        }
    };

    const currentData = dashboardData[selectedView];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">FINANCIALS</h3>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={adjustForInflation}
                            onChange={(e) => setAdjustForInflation(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Adjust for inflation</span>
                    </label>
                </div>

                <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 w-fit">
                    {(['Annual', 'Quarterly', 'TTM'] as const).map((view) => (
                        <button
                            key={view}
                            onClick={() => setSelectedView(view)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedView === view
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300'
                                }`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialMetric
                    title="NET INTEREST INCOME"
                    value={currentData.netInterestIncome.value}
                    unit={currentData.netInterestIncome.unit}
                    growth={currentData.netInterestIncome.growth}
                    data={currentData.netInterestIncome.data}
                    chartType={selectedView === 'Annual' ? 'bar' : 'line'}
                    periods={selectedView === 'Quarterly' ? ['3Y', '5Y', '10Y'] : ['3Y', '5Y', '10Y']}
                    periodGrowth={selectedView === 'TTM' ? ['+23%', '+21%', '+4.3%'] :
                        selectedView === 'Annual' ? ['+21%', '+15%', '+3.7%'] :
                            ['+18%', '+35%', '+4.7%']}
                />

                <FinancialMetric
                    title="NON INTEREST INCOME"
                    value={currentData.nonInterestIncome.value}
                    unit={currentData.nonInterestIncome.unit}
                    growth={currentData.nonInterestIncome.growth}
                    data={currentData.nonInterestIncome.data}
                    chartType={selectedView === 'Annual' ? 'bar' : 'line'}
                    periods={['3Y', '5Y', '10Y']}
                    periodGrowth={selectedView === 'TTM' ? ['+6%', '+10%', '-7%'] :
                        selectedView === 'Annual' ? ['-1%', '+8%', '+2%'] :
                            ['+15%', '+3%', '-2%']}
                />

                <FinancialMetric
                    title="NET INCOME"
                    value={currentData.netIncome.value}
                    unit={currentData.netIncome.unit}
                    growth={currentData.netIncome.growth}
                    data={currentData.netIncome.data}
                    chartType={selectedView === 'Annual' ? 'bar' : 'line'}
                    periods={['3Y', '5Y', '10Y']}
                    periodGrowth={selectedView === 'TTM' ? ['+0%', '+41%', '+16.1%'] :
                        selectedView === 'Annual' ? ['-17%', '-2%', '+470%'] :
                            ['+15%', '+108%', '+51%']}
                />

                <FinancialMetric
                    title="EPS"
                    value={currentData.eps.value}
                    unit={currentData.eps.unit}
                    growth={currentData.eps.growth}
                    data={currentData.eps.data}
                    chartType={selectedView === 'Annual' ? 'bar' : 'line'}
                    periods={['3Y', '5Y', '10Y']}
                    periodGrowth={selectedView === 'TTM' ? ['+7%', '+62%', '+386%'] :
                        selectedView === 'Annual' ? ['-10%', '+17%', '+644%'] :
                            ['+22%', '+141%', '+117%']}
                />
            </div>
        </div>
    );
};

const Main = () => {
    const stockData = {
        price: "48.19",
        change: "0.5%",
        marketCap: "363B USD"
    };

    const companyData = {
        symbol: "BAC",
        name: "Bank of America Corp",
        exchange: "NYSE"
    };

    const navigationTabs = [
        { icon: FileText, label: 'Summary' },
        { icon: Calculator, label: 'DCF Valuation' },
        { icon: BarChart3, label: 'Relative Valuation' },
        { icon: Users, label: 'Wall St Estimates' },
        { icon: TrendingUp, label: 'Profitability' },
        { icon: Heart, label: 'Solvency' },
        { icon: FileText, label: 'Financials' },
        { icon: DollarSign, label: 'Dividends' },
        { icon: Users, label: 'Investor Relations' },
        { icon: Settings, label: 'Discount Rate' }
    ];

    const breadcrumbItems = [
        'Intrinsic Value',
        'Fundamental Analysis',
        'Wall St Price Targets',
        'Dividends',
        'Competitive Landscape',
        'Ownership',
        'News',
        'See Also'
    ];

    const scenarios = ['Worst Case', 'Base Case', 'Best Case'];

    // Financial Dashboard Data
    const wallStData: WallStEstimate[] = [
        { label: 'Price Target', value: '+19%', trend: 'up', percentage: '+19%' },
        { label: 'Revenue Forecast', value: '+6%', trend: 'up', percentage: '+6%' },
        { label: 'Earnings Forecast', value: '+12%', trend: 'up', percentage: '+12%' }
    ];

    const investorReturnsData: InvestorReturn[] = [
        { label: 'Dividend Safety', value: 'Safe', status: 'safe' },
        { label: 'Dividend Yield', value: '2.25%', status: 'moderate' },
        { label: 'Buyback Yield', value: '4.35%', status: 'high' }
    ];

    const insiderTradingData: InsiderTradingData[] = [
        { period: '0-3', months: 'Months', value: '6.8m', trend: 'up', hasBuys: false },
        { period: '0-12', months: 'Months', value: '7.1B', trend: 'down', hasBuys: false }
    ];

    const companyDescription = `Bank of America Corp., a behemoth in the financial services sector, has carved its niche by weaving a complex tapestry of banking operations that touch nearly every aspect of modern financial life. Founded in the early 20th century and headquartered in Charlotte, North Carolina, the company has grown from its roots as a regional player into a global powerhouse. This transformation was facilitated by a series of strategic acquisitions and mergers, including the pivotal acquisition of Merrill Lynch during the financial crisis of 2008. The move bolstered its presence in investment banking, providing a sturdy backbone to its diverse portfolio of services. Today, Bank of America operates through a well-oiled machinery of divisions, including retail banking, corporate, investment banking, and wealth management, each contributing to the overarching goal of financial superindependence.

At the core of its revenue model lies a blend of interest income from loans and deposits, intertwined with non-interest income from service fees and advisory roles. Retail banking remains a cornerstone, serving millions of households with a spectrum of products from everyday checking accounts to mortgages. Meanwhile, its Global Wealth and Investment Management division caters to affluent clients, offering tailored solutions to grow and protect wealth, accentuated by the prestige of Merrill Lynch's brokerage services. Corporate and investment banking, on the other hand, facilitates capital raising, mergers and acquisitions, and risk management for businesses of varying scales. These multifaceted operations not only generate substantial revenue streams from varied interest differentials and fees but also provide a solid foundation for sustainable growth in the ever-evolving finance landscape.`;

    return (
        <div className="min-h-screen bg-gray-100 w-screen">
            <Header
                price={stockData.price}
                change={stockData.change}
                marketCap={stockData.marketCap}
            />

            <CompanyInfo
                symbol={companyData.symbol}
                name={companyData.name}
                exchange={companyData.exchange}
            />

            <NavigationTabs
                tabs={navigationTabs}
                activeTab="Summary"
            />

            <BreadcrumbNav
                items={breadcrumbItems}
                activeItem="Intrinsic Value"
            />

            {/* Main content */}
            <div className="px-6 py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">1. INTRINSIC VALUE</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                        <div className="lg:col-span-2">
                            <IntrinsicValueContent
                                dcfValue="68.38"
                                relativeValue="49.11"
                                currency="USD"
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <IntrinsicValueSidebar
                                intrinsicValue="58.75"
                                currency="USD"
                                undervaluation="18%"
                                scenarios={scenarios}
                                activeScenario="Base Case"
                            />
                        </div>
                    </div>

                    {/* Financial Dashboard Components */}

                    <div className="mt-12 w-full">
                        <ValuationHistoryChart />
                    </div>
                    <div className="mt-12 w-full">
                        <BankOfAmericaChart />
                    </div>

                    {/* New Financial Dashboard Section */}

                    <div className="mt-12 w-full">
                        {/* Top Row - 4 Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <CompanyQuality profitabilityScore={56} solvencyScore={100} />
                            <WallStEstimates estimates={wallStData} />
                            <InvestorReturns returns={investorReturnsData} />
                            <InsiderTrading data={insiderTradingData} />
                        </div>

                        {/* Company Overview */}
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <CompanyOverview
                                companyName="Bank of America Corp"
                                description={companyDescription}
                            />
                        </div>
                    </div>
                    <div className="mt-12 w-full">
                        <FinancialDashboard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;