import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    Clock,
    AlertTriangle,
    UserPlus,
    BookOpen,
    CheckCircle2,
    FileText,
    Edit,
    Save,
    XCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { Lecturer, AssignedStudent, CouncilRole } from '../../data/lecturerData'
import { useTranslation } from '@/contexts/LanguageContext';

interface LecturerDetailPanelProps {
    lecturer: Lecturer | null;
    isOpen: boolean;
    onClose: () => void;
    onAssignStudent: (lecturer: Lecturer) => void;
    onSave?: (updatedItem: Lecturer) => Promise<void> | void;
}

type TabType = 'thong_tin' | 'sinh_vien' | 'hoi_dong' | 'ghi_chu'

export function LecturerDetailPanel({
    lecturer,
    isOpen,
    onClose,
    onAssignStudent,
    onSave
}: LecturerDetailPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('thong_tin')
    const [isEditing, setIsEditing] = useState(false)
    const [editedItem, setEditedItem] = useState<Lecturer | null>(null)
    const { t } = useTranslation();

    // Prevent background scrolling when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Reset tab when lecturer changes
    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false)
            return
        }

        if (lecturer) {
            setActiveTab('thong_tin')
            setIsEditing(false)
            setEditedItem({ ...lecturer })
        } else {
            setEditedItem(null)
        }
    }, [lecturer, isOpen])

    if (!lecturer || !editedItem) return null

    const handleSave = async () => {
        if (!editedItem) return;
        try {
            if (onSave) {
                await onSave(editedItem);
            }
            setIsEditing(false);
            toast.success('Đã lưu thay đổi thông tin giảng viên');
        } catch (error) {
            console.error('Failed to save lecturer:', error);
            toast.error('Lỗi khi lưu thay đổi thông tin giảng viên');
        }
    }

    const capacityPct = editedItem.sv_toi_da > 0
        ? (editedItem.sv_hien_tai / editedItem.sv_toi_da) * 100
        : 0
    const isOverloaded = capacityPct > 100
    const isNearFull = capacityPct >= 80 && !isOverloaded

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white dark:bg-gray-900 
                       shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex-none p-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 mr-4">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={editedItem.name}
                                                onChange={e => setEditedItem(prev => prev ? { ...prev, name: e.target.value } : prev)}
                                                className="font-bold text-lg h-9 w-full"
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    value={editedItem.ma_gv}
                                                    onChange={e => setEditedItem(prev => prev ? { ...prev, ma_gv: e.target.value } : prev)}
                                                    className="text-sm h-8 w-1/3"
                                                    placeholder="Mã GV"
                                                />
                                                <Input
                                                    value={editedItem.bo_mon}
                                                    onChange={e => setEditedItem(prev => prev ? { ...prev, bo_mon: e.target.value } : prev)}
                                                    className="text-sm h-8 flex-1"
                                                    placeholder="Bộ môn"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {editedItem.hoc_vi && `${editedItem.hoc_vi} `}
                                                {editedItem.hoc_ham && `${editedItem.hoc_ham}. `}
                                                {editedItem.name}
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {editedItem.ma_gv} • {editedItem.bo_mon}
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => { setIsEditing(false); setEditedItem({ ...lecturer }); }} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
                                                <XCircle className="w-4 h-4" /> <span className="text-xs font-medium">{t.detail.cancel}</span>
                                            </button>
                                            <button onClick={handleSave} className="p-2 text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                                                <Save className="w-4 h-4" /> <span className="text-xs font-medium">Lưu</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
                                            <Edit className="w-4 h-4" /> <span className="text-xs font-medium">Sửa</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                             bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
                             rounded-full transition-colors ml-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Capacity Bar */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Công suất hướng dẫn</span>
                                    <span className={`text-xs font-bold ${isOverloaded ? 'text-red-600 dark:text-red-400' : isNearFull ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                        {lecturer.sv_hien_tai}/{lecturer.sv_toi_da} SV ({Math.round(capacityPct)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isOverloaded ? 'bg-red-500' : isNearFull ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(capacityPct, 100)}%` }}
                                    />
                                </div>
                                {/* Action button if has slot */}
                                {!isOverloaded && (
                                    <button
                                        onClick={() => onAssignStudent(lecturer)}
                                        className="mt-3 w-full flex items-center justify-center gap-2 py-1.5 
                               bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100
                               text-white dark:text-gray-900 text-sm font-medium rounded-md transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Phân công sinh viên mới
                                    </button>
                                )}
                                {isOverloaded && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                                        <AlertTriangle className="w-4 h-4" />
                                        Đã vượt giới hạn hướng dẫn. Yêu cầu phê duyệt từ Trưởng khoa.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex-none px-6 border-b border-gray-100 dark:border-gray-800 flex gap-6">
                            {[
                                { id: 'thong_tin', label: 'Thông tin' },
                                { id: 'sinh_vien', label: `SV hướng dẫn (${lecturer.sv_hien_tai})` },
                                { id: 'hoi_dong', label: `Hội đồng (${lecturer.hoi_dong_count})` },
                                { id: 'ghi_chu', label: 'Ghi chú' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {activeTab === 'thong_tin' && <InfoTab lecturer={editedItem} isEditing={isEditing} setEditedItem={setEditedItem} />}
                            {activeTab === 'sinh_vien' && <StudentsTab students={editedItem.students} />}
                            {activeTab === 'hoi_dong' && <CouncilsTab councils={editedItem.councils} />}
                            {activeTab === 'ghi_chu' && <NotesTab />}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Subcomponents for tabs
function InfoTab({ lecturer, isEditing, setEditedItem }: { lecturer: Lecturer, isEditing: boolean, setEditedItem: React.Dispatch<React.SetStateAction<Lecturer | null>> }) {
    return (
        <div className="space-y-6">
            {/* Contact */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">Liên hệ & Cá nhân</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    {isEditing ? (
                        <Input
                            value={lecturer.email}
                            onChange={e => setEditedItem(prev => prev ? { ...prev, email: e.target.value } : prev)}
                            className="h-8 text-sm"
                        />
                    ) : (
                        <span>{lecturer.email}</span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    {isEditing ? (
                        <Input
                            value={lecturer.phone || ''}
                            onChange={e => setEditedItem(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                            className="h-8 text-sm"
                            placeholder="Số điện thoại"
                        />
                    ) : (
                        <span>{lecturer.phone}</span>
                    )}
                </div>
            </div>

            {/* Expertise */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">Lĩnh vực nghiên cứu</h3>
                <div className="flex flex-wrap gap-2">
                    {lecturer.expertise.map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Workload Breakout */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2 flex items-center justify-between">
                    Định mức giờ nghĩa vụ
                    <span className="text-xs font-normal text-gray-500 normal-case bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        {lecturer.gio_nghia_vu}/{lecturer.gio_nghia_vu_dinh_muc}h
                    </span>
                </h3>

                <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Hướng dẫn ({lecturer.sv_hien_tai} SV)</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{lecturer.sv_hien_tai * 5}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Chủ tịch HĐ ({lecturer.chu_tich_count} lần)</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{lecturer.chu_tich_count * 4}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Phản biện ({lecturer.phan_bien_count} lần)</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{lecturer.phan_bien_count * 2}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Ủy viên ({lecturer.uy_vien_count} lần)</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{lecturer.uy_vien_count * 1}h</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                    <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-gray-900 dark:text-gray-100">Tổng</span>
                        <span className={lecturer.gio_nghia_vu >= lecturer.gio_nghia_vu_dinh_muc ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}>
                            {lecturer.gio_nghia_vu}h
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StudentsTab({ students }: { students: AssignedStudent[] }) {
    if (students.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 flex flex-col items-center gap-3">
                <GraduationCap className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">Chưa hướng dẫn sinh viên nào trong kỳ này.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {students.map(sv => (
                <div key={sv.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{sv.name}</h4>
                            <p className="font-mono text-xs text-gray-500 mt-0.5">{sv.mssv}</p>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                            Tuần {sv.progress_week}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-3 flex gap-2 items-start">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{sv.thesis_title}</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {sv.thesis_linh_vuc.map(t => (
                            <span key={t} className="text-[10px] bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function CouncilsTab({ councils }: { councils: CouncilRole[] }) {
    if (councils.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 flex flex-col items-center gap-3">
                <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">Chưa phân công hội đồng nào.</p>
            </div>
        )
    }

    // Basic conflict logic: Same day (mock logic)
    const days = councils.map(c => c.ngay_bao_ve.split('T')[0])
    const hasConflict = new Set(days).size !== days.length

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'chu_tich': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            case 'phan_bien': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    const getRoleName = (role: string) => {
        switch (role) {
            case 'chu_tich': return 'Chủ tịch'
            case 'phan_bien': return 'Phản biện'
            case 'uy_vien': return 'Ủy viên'
            case 'thu_ky': return 'Thư ký'
            default: return role
        }
    }

    return (
        <div className="space-y-4">
            {hasConflict && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-xs font-medium flex items-start gap-2 border border-red-200 dark:border-red-800/50">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    Phát hiện trùng lịch hội đồng hoặc quá gần nhau. Vui lòng kiểm tra ngày chấm!
                </div>
            )}

            {councils.map((c, i) => {
                const d = new Date(c.ngay_bao_ve)
                return (
                    <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                {c.ten_hoi_dong}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getRoleColor(c.vai_tro)}`}>
                                {getRoleName(c.vai_tro)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {d.toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-400 w-3.5 text-center">P</span>
                                {c.phong}
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                                {c.so_luan_van} Sinh viên
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function NotesTab() {
    return (
        <div className="flex flex-col h-full">
            <textarea
                placeholder="Ghi chú cá nhân của admin về giảng viên này (chỉ bạn thấy)..."
                className="w-full flex-1 min-h-[200px] p-3 text-sm bg-gray-50 dark:bg-gray-800/50 
                   border border-gray-200 dark:border-gray-800 rounded-xl resize-none
                   text-gray-900 dark:text-gray-100 placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
            />
            <div className="mt-3 flex justify-end">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                           dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 
                           text-sm font-medium rounded-lg transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Lưu tự động
                </button>
            </div>
        </div>
    )
}
