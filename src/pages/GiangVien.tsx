import { useState, useMemo, useEffect } from 'react'
import { LecturerStatsBar } from '../components/lecturer/LecturerStatsBar'
import { LecturerToolbar, type TabKey } from '../components/lecturer/LecturerToolbar'
import { LecturerCard } from '../components/lecturer/LecturerCard'
import { LecturerListItem } from '../components/lecturer/LecturerListItem'
import { LecturerDetailPanel } from '../components/lecturer/LecturerDetailPanel'
import { AssignStudentModal } from '../components/lecturer/AssignStudentModal'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { mockLecturers, calculateGlobalStats, type Lecturer } from '../data/lecturerData'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export function GiangVien() {
    // Global View State
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<TabKey>('all')
    const [selectedDept, setSelectedDept] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)

    // Panel & Modal State
    const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [lecturerToAssign, setLecturerToAssign] = useState<Lecturer | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700)
        return () => clearTimeout(timer)
    }, [])

    // Derived Global Stats
    const globalStats = useMemo(() => calculateGlobalStats(mockLecturers), [])

    // Derived tab counts & Filter logic
    const { filteredLecturers, tabCounts } = useMemo(() => {
        // 1. First, compute tab counts purely based on core condition (ignoring search/dept) to populate tabs globally
        const counts: Record<TabKey, number> = {
            all: mockLecturers.length,
            con_slot: 0,
            sap_day: 0,
            qua_tai: 0,
            chua_phan_cong: 0
        }

        mockLecturers.forEach(l => {
            const pct = l.sv_toi_da > 0 ? l.sv_hien_tai / l.sv_toi_da : 0
            if (pct < 0.8) counts.con_slot++;
            if (pct >= 0.8 && pct <= 1) counts.sap_day++;
            if (pct > 1) counts.qua_tai++;
            if (l.sv_hien_tai === 0 && l.hoi_dong_count === 0) counts.chua_phan_cong++;
        })

        // 2. Filter lecturers based on all current state
        const result = mockLecturers.filter(l => {
            // Basic text search
            const q = searchQuery.toLowerCase()
            const matchesSearch = l.name.toLowerCase().includes(q) || l.ma_gv.toLowerCase().includes(q)
            if (!matchesSearch) return false

            // Dept filter
            if (selectedDept !== 'all' && l.bo_mon !== selectedDept) return false

            // Tab filter
            const pct = l.sv_toi_da > 0 ? l.sv_hien_tai / l.sv_toi_da : 0
            switch (activeTab) {
                case 'all': return true;
                case 'con_slot': return pct < 0.8;
                case 'sap_day': return pct >= 0.8 && pct <= 1;
                case 'qua_tai': return pct > 1;
                case 'chua_phan_cong': return l.sv_hien_tai === 0 && l.hoi_dong_count === 0;
                default: return true;
            }
        })

        return { filteredLecturers: result, tabCounts: counts }
    }, [searchQuery, selectedDept, activeTab])

    // Pagination
    const totalPages = Math.ceil(filteredLecturers.length / ITEMS_PER_PAGE)
    const currentLecturers = filteredLecturers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Handlers
    const handleAssignClick = (lecturer: Lecturer) => {
        setLecturerToAssign(lecturer)
        setIsAssignModalOpen(true)
    }

    const handleConfirmAssignment = (studentIds: string[]) => {
        console.log(`Assigning ${studentIds.length} students to ${lecturerToAssign?.name}`)
        // Real implementation would update logic here
        // alert(`Đã phân công ${studentIds.length} sinh viên cho GV ${lecturerToAssign?.name}`)
    }

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1) }, [searchQuery, selectedDept, activeTab])

    if (loading) {
        return <LoadingSpinner fullScreen text="Đang tải danh sách giảng viên..." />
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Giảng viên</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Quản lý thư mục giảng viên, định mức nghĩa vụ và theo dõi tiến độ công việc trong kỳ.
                </p>
            </div>

            {/* Primary Stats */}
            <LecturerStatsBar stats={globalStats} />

            {/* Tools */}
            <LecturerToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedDepartment={selectedDept}
                setSelectedDepartment={setSelectedDept}
                viewMode={viewMode}
                setViewMode={setViewMode}
                tabCounts={tabCounts}
            />

            {/* Content Area */}
            <div className="mt-4">
                <AnimatePresence mode="popLayout">
                    {currentLecturers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
                                <AlertCircle className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Không tìm thấy giảng viên</h3>
                            <p className="text-xs text-gray-500 mt-1">Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
                        </motion.div>
                    ) : viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {currentLecturers.map(lecturer => (
                                <LecturerCard
                                    key={lecturer.id}
                                    lecturer={lecturer}
                                    onClick={() => setSelectedLecturer(lecturer)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            {currentLecturers.map(lecturer => (
                                <LecturerListItem
                                    key={lecturer.id}
                                    lecturer={lecturer}
                                    onClick={() => setSelectedLecturer(lecturer)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Basic Pagination Header */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Hiển thị từ {(currentPage - 1) * ITEMS_PER_PAGE + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, filteredLecturers.length)} trong số {filteredLecturers.length} GV
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Off-canvas Right Panel */}
            <LecturerDetailPanel
                lecturer={selectedLecturer}
                isOpen={selectedLecturer !== null}
                onClose={() => setSelectedLecturer(null)}
                onAssignStudent={handleAssignClick}
            />

            {/* Assignment Modal overlay */}
            {lecturerToAssign && (
                <AssignStudentModal
                    isOpen={isAssignModalOpen}
                    onClose={() => {
                        setIsAssignModalOpen(false)
                        setLecturerToAssign(null)
                    }}
                    lecturer={lecturerToAssign}
                    onConfirm={handleConfirmAssignment}
                />
            )}
        </div>
    )
}
