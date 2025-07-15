import { MarketHeader } from "@/components/MarketHeader";
import { ResizableLayout } from "@/components/ResizableLayout";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <MarketHeader />
      <div className="p-4">
        <ResizableLayout />
      </div>
    </div>
  );
};

export default Index;
