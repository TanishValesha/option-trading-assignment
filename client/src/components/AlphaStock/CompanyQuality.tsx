import { BarChart3 } from "lucide-react";


interface CompanyQualityProps {
    profitabilityScore: number;
    solvencyScore: number;
}

const CompanyQuality = ({ profitabilityScore, solvencyScore }: CompanyQualityProps) => {
    const CircularProgress = ({ score, max }: { score: number; max: number }) => {
        const percentage = (score / max) * 100;
        const strokeDasharray = 2 * Math.PI * 45;
        const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

        return (
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#6b7280"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">{score}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Company Quality</h3>
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div>
                            <div className="text-xs text-gray-600">Profitability Score</div>
                            <div className="text-sm font-medium text-gray-800">{profitabilityScore}/100</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div>
                            <div className="text-xs text-gray-600">Solvency Score</div>
                            <div className="text-sm font-medium text-gray-800">{solvencyScore}/100</div>
                        </div>
                    </div>
                </div>

                <CircularProgress score={profitabilityScore} max={100} />
            </div>
        </div>
    );
}

export default CompanyQuality