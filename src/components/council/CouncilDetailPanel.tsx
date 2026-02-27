import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Calendar,
    Users,
    Clock,
    GraduationCap,
    PlayCircle,
    CheckCircle2,
    AlertCircle,
    Mail,
    FileText,
    Star
} from 'lucide-react'
import type { Council } from '../../data/councilData'
import { InitialName } from '@/helpers/InitialName'

interface CouncilDetailPanelProps {
    council: Council | null;
    isOpen: boolean;
    onClose: () => void;
    onOpenInvites: () => void;
}

type TabType = 'members' | 'schedule' | 'grading' | 'notes';



const getColor = (str: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500']
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
}

const getStatusColor = (status: Council['status'] | string) => {
    switch (status) {
        case 'Chờ diễn ra': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        case 'Đang diễn ra': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        case 'Đã hoàn thành': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
        case 'Cần chú ý': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        default: return 'bg-muted text-muted-foreground border-border/50'
    }
}

export function CouncilDetailPanel({ council, isOpen, onClose, onOpenInvites }: CouncilDetailPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('members')
    const [selectedSessionForGrading, setSelectedSessionForGrading] = useState<string | null>(null)

    if (!isOpen || !council) return null

    // Ensure state resets when a new council is selected
    const progressPercent = Math.round((council.sessions_completed / council.sessions_total) * 100) || 0

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-2xl h-full bg-card border-l border-border/50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/50 shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-500/50" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold tracking-tight">{council.name}</h2>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center ${getStatusColor(council.status)}`}>
                                            {council.status}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground flex items-center">
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        {council.field}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onOpenInvites}
                                        className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors flex items-center text-sm px-4 font-medium"
                                        title="Gửi email/thông báo cho HĐ"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Gửi thông báo
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="font-medium text-foreground">{new Date(council.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span className="font-medium text-foreground">{council.members.length}</span>
                                    <span className="ml-1">Thành viên</span>
                                </div>
                                <div className="flex-1 max-w-[200px]">
                                    <div className="flex justify-between items-center text-xs mb-1">
                                        <span className="text-muted-foreground">Tiến độ ({council.sessions_completed}/{council.sessions_total})</span>
                                        <span className="font-medium">{progressPercent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-border/50 shrink-0 px-6">
                            {[
                                { id: 'members', label: 'HĐ & Thành viên', icon: Users },
                                { id: 'schedule', label: 'Lịch bảo vệ', icon: Calendar },
                                { id: 'grading', label: 'Chấm điểm', icon: Star },
                                { id: 'notes', label: 'Ghi chú', icon: FileText },
                            ].map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`
                      flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'}
                    `}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {/* Tab: Members */}
                            {activeTab === 'members' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Danh sách hội đồng</h3>
                                        <button className="text-sm text-primary hover:underline font-medium">
                                            + Thêm thành viên
                                        </button>
                                    </div>

                                    <div className="grid gap-4">
                                        {council.members.map(member => (
                                            <div key={member.id} className="p-4 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getColor(member.name)}`}>
                                                        {InitialName(member.name)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-foreground">{member.name}</h4>
                                                        <div className="flex items-center text-xs text-muted-foreground mt-0.5 space-x-3">
                                                            <span>{member.department}</span>
                                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                            <span>{member.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md border
                            ${member.role === 'Chủ tịch' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                                            member.role === 'Thư ký' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                member.role === 'Phản biện' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                                    'bg-muted text-muted-foreground border-border/50'}
                          `}>
                                                        {member.role}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Schedule */}
                            {activeTab === 'schedule' && (
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg">Phiên bảo vệ</h3>

                                    <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                                        {council.sessions.map((session, i) => (
                                            <div key={session.id} className="relative pl-6">
                                                {/* Timeline Node */}
                                                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-background 
                          ${session.status === 'Đã hoàn thành' ? 'bg-purple-500' :
                                                        session.status === 'Đang diễn ra' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                            'bg-muted-foreground/30'}`}
                                                />

                                                <div className="bg-muted/20 border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-colors group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
                                                                {session.time_start} - {session.time_end}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusColor(session.status)}`}>
                                                                {session.status}
                                                            </span>
                                                        </div>
                                                        {session.score !== undefined && (
                                                            <span className="text-sm font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-md border border-green-500/20">
                                                                {session.score} điểm
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h4 className="font-medium text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                                                        {session.thesis_title}
                                                    </h4>

                                                    <div className="flex items-center justify-between mt-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${getColor(session.student_name)}`}>
                                                                {InitialName(session.student_name)}
                                                            </div>
                                                            <span className="font-medium">{session.student_name}</span>
                                                            <span className="text-muted-foreground">({session.mssv})</span>
                                                        </div>
                                                        <span className="text-muted-foreground flex items-center bg-background px-2 py-1 rounded-md border border-border/50 text-xs shadow-sm">
                                                            {session.room}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Grading */}
                            {activeTab === 'grading' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 mr-3" />
                                        <div className="text-sm text-amber-500/90">
                                            <strong>Lưu ý:</strong> Phiếu chấm điểm chỉ hiển thị với các phiên bảo vệ Đang diễn ra hoặc Đã hoàn thành. Điểm cuối cùng là trung bình cộng của các thành viên.
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-foreground block">Chọn sinh viên / Đề tài để chấm điểm</label>
                                        <select
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            value={selectedSessionForGrading || ""}
                                            onChange={(e) => setSelectedSessionForGrading(e.target.value)}
                                        >
                                            <option value="" disabled>-- Chọn sinh viên --</option>
                                            {council.sessions.filter(s => s.status !== 'Chờ diễn ra').map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.student_name} ({s.time_start} - {s.time_end}) - {s.thesis_title.substring(0, 30)}...
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedSessionForGrading && (
                                        <div className="mt-8 border border-border/50 rounded-xl overflow-hidden bg-card">
                                            <div className="bg-muted/50 p-4 border-b border-border/50 flex justify-between items-center">
                                                <h4 className="font-medium flex items-center">
                                                    <Star className="w-4 h-4 mr-2 text-primary" />
                                                    Phiếu chấm điểm (Rubric)
                                                </h4>
                                                <span className="text-sm font-bold text-primary">Tổng: 0/10</span>
                                            </div>
                                            <div className="divide-y divide-border/50">
                                                {council.criteria.map((criterion, idx) => (
                                                    <div key={criterion.id} className="p-4 hover:bg-muted/20 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded text-muted-foreground mb-1 block w-max">
                                                                    Tiêu chí {idx + 1}
                                                                </span>
                                                                <h5 className="font-medium text-sm">{criterion.name}</h5>
                                                                <p className="text-xs text-muted-foreground mt-1">{criterion.description}</p>
                                                            </div>
                                                            <div className="w-24 shrink-0 relative">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={criterion.max_score}
                                                                    step="0.5"
                                                                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder={`/ ${criterion.max_score}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-muted/20 border-t border-border/50 flex justify-end gap-3">
                                                <button className="px-4 py-2 text-sm font-medium border border-border bg-background rounded-lg hover:bg-muted transition-colors">
                                                    Lưu nháp
                                                </button>
                                                <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                                                    Hoàn tất chấm điểm
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Notes */}
                            {activeTab === 'notes' && (
                                <div className="space-y-4">
                                    <textarea
                                        placeholder="Thêm ghi chú cá nhân về hội đồng này... (Ghi chú này hiển thị riêng cho bạn)"
                                        className="w-full h-40 bg-muted/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                            Lưu ghi chú
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
