import { motion } from 'framer-motion'
import {
    Users,
    CheckCircle2,
    AlertTriangle,
    Clock,
    PlayCircle
} from 'lucide-react'
import type { CouncilStats } from '../../data/councilData'

interface CouncilStatsBarProps {
    stats: CouncilStats;
}

export function CouncilStatsBar({ stats }: CouncilStatsBarProps) {
    const items = [
        {
            label: 'Tổng HĐ',
            value: stats.total,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: 'Chờ diễn ra',
            value: stats.upcoming,
            icon: Clock,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10'
        },
        {
            label: 'Đang diễn ra',
            value: stats.inProgress,
            icon: PlayCircle,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10'
        },
        {
            label: 'Đã hoàn thành',
            value: stats.completed,
            icon: CheckCircle2,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10'
        },
        {
            label: 'Cần chú ý',
            value: stats.needsAttention,
            icon: AlertTriangle,
            color: 'text-rose-500',
            bgColor: 'bg-rose-500/10'
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {items.map((item, index) => {
                const Icon = item.icon
                return (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-card border border-border/50 rounded-xl p-4 flex items-center space-x-4"
                    >
                        <div className={`p-3 rounded-lg ${item.bgColor}`}>
                            <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                            <h3 className="text-2xl font-bold tracking-tight mt-1">{item.value}</h3>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
