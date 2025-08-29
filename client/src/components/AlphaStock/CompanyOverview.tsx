import { BarChart3, Building2, Calendar, Phone, TrendingUp, Users } from 'lucide-react';

interface CompanyOverviewProps {
    companyName: string;
    description: string;
}


const CompanyOverview = ({ companyName, description }: CompanyOverviewProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-700 p-6 text-white relative">
                <div className="absolute right-4 top-4 opacity-20">
                    <Building2 className="w-16 h-16" />
                </div>
                <h2 className="text-xl font-bold mb-2">{companyName}</h2>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide">Company Overview</h3>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">Overview</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Business Segments</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Economic Moat</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Management</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Earnings Calls</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Contacts</span>
                    </div>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
}

export default CompanyOverview