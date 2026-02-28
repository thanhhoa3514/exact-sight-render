import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { CouncilStatsBar } from '../components/council/CouncilStatsBar'
import { CouncilToolbar, type TabKey } from '../components/council/CouncilToolbar'
import { CouncilCard } from '../components/council/CouncilCard'
import { CouncilListItem } from '../components/council/CouncilListItem'
import { CouncilDetailPanel } from '../components/council/CouncilDetailPanel'
import { SendInvitesModal } from '../components/council/SendInvitesModal'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { mockCouncils, calculateCouncilStats, type Council } from '../data/councilData'

export function HoiDong() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<TabKey>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(true)

    // Selection & Modals
    const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isInvitesOpen, setIsInvitesOpen] = useState(false)

    // Pagination (Simple implementation for UI purposes)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700)
        return () => clearTimeout(timer)
    }, [])

    const stats = useMemo(() => calculateCouncilStats(mockCouncils), [])

    const filteredCouncils = useMemo(() => {
        return mockCouncils.filter(council => {
            // 1. Filter by Tab
            if (activeTab === 'cho_dien_ra' && council.status !== 'Chờ diễn ra') return false;
            if (activeTab === 'dang_dien_ra' && council.status !== 'Đang diễn ra') return false;
            if (activeTab === 'da_hoan_thanh' && council.status !== 'Đã hoàn thành') return false;
            if (activeTab === 'can_chu_y' && council.status !== 'Cần chú ý') return false;

            // 2. Filter by Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchName = council.name.toLowerCase().includes(query)
                const matchField = council.field.toLowerCase().includes(query)
                const matchMember = council.members.some(m => m.name.toLowerCase().includes(query))
                const matchStudent = council.sessions.some(s =>
                    s.student_name.toLowerCase().includes(query) ||
                    s.mssv.toLowerCase().includes(query)
                )
                return matchName || matchField || matchMember || matchStudent
            }

            return true;
        })
    }, [searchQuery, activeTab])

    // Pagination logic
    const totalPages = Math.ceil(filteredCouncils.length / itemsPerPage)
    const currentCouncils = filteredCouncils.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleOpenDetail = (council: Council) => {
        setSelectedCouncil(council)
        setIsDetailOpen(true)
    }

    const handleOpenInvites = () => {
        // Keep detail open, just show modal on top
        setIsInvitesOpen(true)
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Đang tải hội đồng..." />
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Profile/Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hội đồng Bảo vệ</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và tổ chức các phiên bảo vệ khóa luận.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                        <Plus className="w-5 h-5 mr-2" />
                        Lập hội đồng mới
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <CouncilStatsBar stats={stats} />

            {/* Toolbar */}
            <CouncilToolbar
                searchQuery={searchQuery}
                setSearchQuery={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                activeTab={activeTab}
                setActiveTab={(t) => { setActiveTab(t); setCurrentPage(1); }}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Main Content Grid/List */}
            {currentCouncils.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentCouncils.map((council, index) => (
                                <CouncilCard
                                    key={council.id}
                                    council={council}
                                    index={index}
                                    onClick={handleOpenDetail}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {currentCouncils.map((council) => (
                                <CouncilListItem
                                    key={council.id}
                                    council={council}
                                    onClick={handleOpenDetail}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center gap-2 bg-card border border-border/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Trước
                                </button>
                                <div className="flex items-center space-x-1 px-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-card border border-border/50 rounded-xl border-dashed">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Không tìm thấy hội đồng nào</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Không có hội đồng nào khớp với điều kiện tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc từ khóa.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setActiveTab('all')
                        }}
                        className="mt-6 px-4 py-2 font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Detail Slide-in Panel */}
            <CouncilDetailPanel
                council={selectedCouncil}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onOpenInvites={handleOpenInvites}
            />

            {/* Send Invites Modal */}
            <SendInvitesModal
                isOpen={isInvitesOpen}
                onClose={() => setIsInvitesOpen(false)}
                council={selectedCouncil}
            />
        </div>
    )
}


