import { Search, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react'
import { DEPARTMENTS } from '../../data/lecturerData'

export type TabKey = 'all' | 'con_slot' | 'sap_day' | 'qua_tai' | 'chua_phan_cong'

interface LecturerToolbarProps {
    searchQuery: string
    setSearchQuery: (s: string) => void
    activeTab: TabKey
    setActiveTab: (t: TabKey) => void
    selectedDepartment: string
    setSelectedDepartment: (d: string) => void
    viewMode: 'grid' | 'list'
    setViewMode: (v: 'grid' | 'list') => void
    tabCounts: Record<TabKey, number>
}

export function LecturerToolbar({
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    selectedDepartment,
    setSelectedDepartment,
    viewMode,
    setViewMode,
    tabCounts
}: LecturerToolbarProps) {

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'all', label: 'Tất cả' },
        { key: 'con_slot', label: 'Còn slot' },
        { key: 'sap_day', label: 'Sắp đầy' },
        { key: 'qua_tai', label: 'Quá tải' },
        { key: 'chua_phan_cong', label: 'Chưa phân công' },
    ]

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Top row: Search, Filters, View Toggles */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mã GV..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Department Filter (Simulated Select) */}
                    <div className="relative group">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-gray-400 transition-colors cursor-pointer"
                        >
                            <option value="all">Tất cả bộ môn</option>
                            {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggles */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${activeTab === tab.key
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.key
                                ? 'bg-gray-700 dark:bg-gray-200 text-gray-100 dark:text-gray-800'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}>
                            {tabCounts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
