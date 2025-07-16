import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { OptionsChain } from "./OptionsChain";
import { PayoffChart } from "./PayoffChart";
import { PositionsPanel } from "./PositionsPanel";

export function ResizableLayout() {
    return (
        <div className="h-[calc(100vh-120px)] w-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={45} minSize={35}>
                    <OptionsChain />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={55} minSize={30}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={35} minSize={20}>
                            <PayoffChart />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize={35} minSize={25}>
                            <PositionsPanel />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
