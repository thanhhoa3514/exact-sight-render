import { motion } from 'framer-motion'
import { Calendar, Users, GraduationCap, AlertCircle, Clock, PlayCircle, CheckCircle2 } from 'lucide-react'
import type { Council } from '../../data/councilData'
import { InitialName } from '@/helpers/InitialName'
import getColor from '@/helpers/GetColor'
import { GetStatusIcon } from '@/helpers/GetStatusIcon'
import { GetStatusColor } from '@/helpers/GetStatusColor'

interface CouncilCardProps {
    council: Council;
    onClick: (council: Council) => void;
    index: number;
}

export function CouncilCard({ council, onClick, index }: CouncilCardProps) {
    const progressPercent = council.sessions_total > 0
        ? Math.min(100, Math.max(0, Math.round((council.sessions_completed / council.sessions_total) * 100)))
        : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick(council)
                }
            }}
            onClick={() => onClick(council)}
            className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{council.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                        {council.field}
                    </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center whitespace-nowrap ${GetStatusColor(council.status)}`}>
                    {GetStatusIcon(council.status)}
                    {council.status}
                </span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-4">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(council.date).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" />
                    {council.members.length} Thành viên
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-auto pt-4 border-t border-border/50">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Tiến độ bảo vệ</span>
                    <span className="font-medium">{council.sessions_completed}/{council.sessions_total} SV</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.05) }}
                    />
                </div>
            </div>

            {/* Member Avatars */}
            <div className="mt-5 flex justify-between items-center">
                <div className="flex -space-x-2 overflow-hidden">
                    {council.members.slice(0, 4).map((member, i) => (
                        <div
                            key={member.id}
                            className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white shadow-sm ${getColor(member.name)}`}
                            title={`${member.role}: ${member.name}`}
                            style={{ zIndex: 10 - i }}
                        >
                            {InitialName(member.name)}
                        </div>
                    ))}
                    {council.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium bg-muted text-muted-foreground shadow-sm" style={{ zIndex: 1 }}>
                            +{council.members.length - 4}
                        </div>
                    )}
                </div>

                {council.status === 'Cần chú ý' && (
                    <div className="flex items-center text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Thiếu TV
                    </div>
                )}
            </div>
        </motion.div>
    )
}
