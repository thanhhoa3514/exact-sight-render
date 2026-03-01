import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Check, AlertTriangle, Info } from 'lucide-react'
import type { Lecturer } from '../../data/lecturerData'
import { unassignedStudents } from '../../data/lecturerData' // Using the mock unassigned pool directly for simplicity

interface AssignStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    lecturer: Lecturer;
    onConfirm: (studentIds: string[]) => void;
}

export function AssignStudentModal({ isOpen, onClose, lecturer, onConfirm }: AssignStudentModalProps) {
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    if (!isOpen) return null

    const capacityPct = lecturer.sv_toi_da > 0
        ? (lecturer.sv_hien_tai / lecturer.sv_toi_da) * 100
        : 0

    const remainingSlots = Math.max(0, lecturer.sv_toi_da - lecturer.sv_hien_tai)
    const willOverload = selectedIds.size > remainingSlots

    const filteredStudents = unassignedStudents.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.mssv.includes(search) ||
        s.thesis_linh_vuc.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )

    const toggleStudent = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    const handleConfirm = () => {
        onConfirm(Array.from(selectedIds))
        setSelectedIds(new Set())
        onClose()
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Phân công sinh viên mới</h2>
                            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chọn sinh viên từ danh sách chờ để phân công cho Giảng viên <span className="font-semibold text-gray-900 dark:text-gray-100">{lecturer.name}</span>.
                        </p>
                    </div>

                    {/* Context Banner */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1 text-sm font-medium">
                                <span className="text-gray-700 dark:text-gray-300">Công suất hiện tại</span>
                                <span className="text-gray-900 dark:text-gray-100">{lecturer.sv_hien_tai}/{lecturer.sv_toi_da} SV ({Math.round(capacityPct)}%)</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${capacityPct >= 100 ? 'bg-red-500' : capacityPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(capacityPct, 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                                <Info className="w-3.5 h-3.5" />
                                {remainingSlots > 0 ? (
                                    <span>Có thể nhận thêm <strong className="text-emerald-600 dark:text-emerald-400">{remainingSlots}</strong> sinh viên để đạt định mức.</span>
                                ) : (
                                    <span className="text-red-500 dark:text-red-400 font-medium">Giảng viên đã đủ hoặc vượt định mức. Việc phân thêm sẽ tính là vượt giờ.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex-1 overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm SV theo tên, MSSV, hoặc hướng đề tài..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
                            />
                        </div>

                        {/* Student List */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                            {filteredStudents.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                    Không tìm thấy sinh viên nào phù hợp.
                                </div>
                            ) : (
                                filteredStudents.map(sv => {
                                    const isSelected = selectedIds.has(sv.id);
                                    // Match validation
                                    // Check if lecturer expertise matches student field
                                    const matchTags = sv.thesis_linh_vuc.filter(t => lecturer.expertise.includes(t))
                                    const isMatch = matchTags.length > 0

                                    return (
                                        <div
                                            key={sv.id}
                                            onClick={() => toggleStudent(sv.id)}
                                            className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3
                          ${isSelected
                                                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                                                }
                        `}
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors
                           ${isSelected ? 'bg-gray-900 dark:bg-white border-transparent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-white dark:text-gray-900" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{sv.name} - {sv.mssv}</p>
                                                    {isMatch ? (
                                                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                                            Match Lĩnh vực
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                                            Khác Lĩnh vực
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">Đề tài: {sv.thesis_title}</p>
                                                <div className="flex gap-1.5">
                                                    {sv.thesis_linh_vuc.map(t => (
                                                        <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded border
                                   ${matchTags.includes(t)
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                                : 'border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'
                                                            }
                                 `}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm">
                            Đã chọn: <strong className="text-gray-900 dark:text-gray-100">{selectedIds.size} sinh viên</strong>
                        </div>

                        {willOverload && selectedIds.size > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                <AlertTriangle className="w-4 h-4" /> Vượt công suất!
                            </div>
                        )}

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t.detail.cancel}
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={selectedIds.size === 0}
                                className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Xác nhận phân công
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
