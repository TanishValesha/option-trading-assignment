import { MarketHeader } from "@/components/MarketHeader";
import { ResizableLayout } from "@/components/ResizableLayout";

const Index = () => {
    return (
        <div className="min-h-screen w-screen bg-slate-50">
            <MarketHeader />
            <div className="w-full max-w-none">
                <ResizableLayout />
            </div>
        </div>
    );
};

export default Index;