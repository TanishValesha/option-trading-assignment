// src/App.tsx
import { useStockData } from '../../hooks/useStockData';
import Header from '../../components/Stock-Screener/Header';
import Controls from '../../components/Stock-Screener/Controls';
import StockGrid from '../../components/Stock-Screener/StockGrid';
import MessageArea from '../../components/Stock-Screener/MessageArea';
import { Toaster } from 'sonner';
import { seoConfig } from '@/lib/seoConfig';
import { useSEO } from '@/hooks/useSEO';

function StockScreener() {
    const {
        displayedStocks,
        indices,
        selectedIndex,
        setSelectedIndex,
        searchTerm,
        setSearchTerm,
        currentSort,
        handleSort,
        message,
        loading
    } = useStockData();

    useSEO({
        title: seoConfig.stockScreener.title,
        description: seoConfig.stockScreener.description,
        keywords: seoConfig.stockScreener.keywords,
        canonical: seoConfig.stockScreener.canonical,
        image: '/og-stock-screener.jpg'
    });

    return (<>
        <div className="min-h-screen w-screen p-10 md:px-40 text-gray-300 overflow-auto">
            <div className="max-w-screen-5xl mx-auto">
                <Header
                    indices={indices}
                    selectedIndex={selectedIndex}
                    onIndexChange={setSelectedIndex}
                />
                <Controls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    currentSort={currentSort}
                    onSort={handleSort}
                />
                {loading && <MessageArea message="Loading stocks..." />}
                {!loading && message && <MessageArea message={message} />}
                {!loading && displayedStocks.length > 0 && <StockGrid stocks={displayedStocks} />}
            </div>
            <Toaster />
        </div>
    </>
    );
}

export default StockScreener;