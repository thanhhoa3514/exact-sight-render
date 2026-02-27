import { Search, LayoutGrid, List as ListIcon, ChevronDown, Filter } from 'lucide-react'

export type TabKey = 'all' | 'cho_dien_ra' | 'dang_dien_ra' | 'da_hoan_thanh' | 'can_chu_y'

interface CouncilToolbarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export function CouncilToolbar({
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode
}: CouncilToolbarProps) {
    const tabs: { key: TabKey, label: string }[] = [
        { key: 'all', label: 'Tất cả' },
        { key: 'cho_dien_ra', label: 'Chờ diễn ra' },
        { key: 'dang_dien_ra', label: 'Đang diễn ra' },
        { key: 'da_hoan_thanh', label: 'Đã hoàn thành' },
        { key: 'can_chu_y', label: 'Cần chú ý' },
    ]

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card border border-border/50 rounded-xl p-2">

            {/* Search & Period Select */}
            <div className="flex flex-1 w-full lg:w-auto items-center gap-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm hội đồng, giảng viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>

                <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-muted/50 transition-colors whitespace-nowrap">
                    <span>Đợt bảo vệ 1 (HK2 24-25)</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Tabs & View Toggles */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                {/* Status Tabs */}
                <div className="flex items-center p-1 bg-background border border-border rounded-lg overflow-x-auto select-none no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap
                ${activeTab === tab.key
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* View Mode (Grid / List) */}
                <div className="flex items-center p-1 bg-background border border-border rounded-lg hidden sm:flex">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-muted text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-muted text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        title="List View"
                    >
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    )
}
