import { motion } from 'framer-motion'
import {
    Users,
    GraduationCap,
    AlertTriangle,
    UserPlus,
    AlertCircle
} from 'lucide-react'
import type { LecturerStats } from '../../data/lecturerData'

interface LecturerStatsBarProps {
    stats: LecturerStats;
}

export function LecturerStatsBar({ stats }: LecturerStatsBarProps) {
    const cards = [
        {
            label: 'Tổng giảng viên',
            value: stats.total,
            icon: Users,
            color: 'text-gray-900 dark:text-gray-100',
            sub: `${stats.bo_mon_count} bộ môn`,
        },
        {
            label: 'Đang hướng dẫn',
            value: stats.dang_huong_dan,
            icon: GraduationCap,
            color: 'text-violet-600 dark:text-violet-400',
            sub: `${stats.tong_sv_duoc_hd} sinh viên`,
        },
        {
            label: 'Sắp đầy slot',
            value: stats.sap_day,
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            sub: '≥ 80% công suất',
            alert: true,
        },
        {
            label: 'Còn trống',
            value: stats.con_trong,
            icon: UserPlus,
            color: 'text-emerald-600 dark:text-emerald-400',
            sub: 'Có thể nhận thêm SV',
        },
        {
            label: 'Quá tải',
            value: stats.qua_tai,
            icon: AlertCircle,
            color: 'text-red-600 dark:text-red-400',
            sub: 'Vượt định mức',
            danger: true,
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {cards.map((card, i) => {
                const Icon = card.icon
                return (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`
              bg-white dark:bg-gray-900 rounded-xl p-4 border
              ${card.danger
                                ? 'border-red-200 dark:border-red-900/50'
                                : card.alert
                                    ? 'border-amber-200 dark:border-amber-900/50'
                                    : 'border-gray-200 dark:border-gray-800'
                            }
            `}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">{card.label}</span>
                            <Icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <p className={`text-2xl font-bold tracking-tight ${card.color}`}>
                            {card.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                    </motion.div>
                )
            })}
        </div>
    )
}
