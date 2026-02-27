import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import type { TourMediaContentProps } from './onboarding.types'

export function TourMediaContent({ type }: TourMediaContentProps) {
    if (type === 'welcome') return (
        // Animated logo + welcome illustration
        <div className="flex flex-col items-center gap-4">
            <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
                className="text-5xl">
                👋
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Graduation Thetis System Management
                </div>
                <div className="text-sm text-gray-400 mt-1">Technology Falcucy</div>
            </motion.div>
        </div>
    )

    if (type === 'dashboard_preview') return (
        // Mini dashboard mockup — animated KPI cards
        <div className="w-full px-6 py-4 space-y-3">
            {/* Mini KPI row */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { n: '142', l: 'Luận văn', color: 'bg-gray-900' },
                    { n: '38', l: 'Đang HD', color: 'bg-violet-500' },
                    { n: '15', l: 'Chờ duyệt', color: 'bg-amber-500' },
                    { n: '12', l: 'Bảo vệ', color: 'bg-emerald-500' },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.l}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-2.5
                       border border-gray-200 dark:border-gray-700"
                    >
                        <div className={`text-lg font-bold text-gray-900 dark:text-gray-100`}>
                            {kpi.n}
                        </div>
                        <div className="text-[10px] text-gray-400">{kpi.l}</div>
                    </motion.div>
                ))}
            </div>
            {/* Mini chart bar mockup */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3
                      border border-gray-200 dark:border-gray-700">
                <div className="flex items-end gap-1.5 h-8">
                    {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-sm"
                        />
                    ))}
                </div>
            </div>
        </div>
    )

    if (type === 'topics_preview') return (
        // Mini card grid mockup
        <div className="w-full px-6 py-4">
            <div className="grid grid-cols-3 gap-2">
                {[
                    { title: 'ML trong phát hiện gian lận', status: 'Đang TH', color: 'bg-violet-100 text-violet-700' },
                    { title: 'IoT giám sát môi trường', status: 'Đã duyệt', color: 'bg-blue-100 text-blue-700' },
                    { title: 'Chatbot tuyển sinh', status: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-2.5
                       border border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-[9px] font-medium text-gray-700 dark:text-gray-300
                          line-clamp-2 leading-tight mb-2">{card.title}</p>
                        <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${card.color}`}>
                            {card.status}
                        </span>
                    </motion.div>
                ))}
            </div>
            {/* Highlight panel opening effect */}
            <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-2 bg-white dark:bg-gray-800 rounded-lg p-2.5
                   border-2 border-gray-900 dark:border-white
                   flex items-center gap-2"
            >
                <div className="w-1 h-6 bg-violet-500 rounded-full" />
                <div>
                    <p className="text-[8px] font-mono text-gray-400">DT-2025-001</p>
                    <p className="text-[9px] font-medium text-gray-700 dark:text-gray-300">
                        ML trong phát hiện gian lận
                    </p>
                </div>
            </motion.div>
        </div>
    )

    if (type === 'shortcuts_preview') return (
        // Keyboard visual
        <div className="flex flex-col items-center gap-3">
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-2"
            >
                <kbd className="px-3 py-2 text-sm font-mono font-bold
                        bg-gray-900 dark:bg-white text-white dark:text-gray-900
                        border-2 border-gray-700 rounded-xl
                        shadow-[0_4px_0_rgba(0,0,0,0.4)]">
                    ⌘
                </kbd>
                <kbd className="px-3 py-2 text-sm font-mono font-bold
                        bg-gray-900 dark:bg-white text-white dark:text-gray-900
                        border-2 border-gray-700 rounded-xl
                        shadow-[0_4px_0_rgba(0,0,0,0.4)]">
                    K
                </kbd>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl border
                   border-gray-200 dark:border-gray-700
                   shadow-lg px-4 py-3 w-48"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">Tìm kiếm...</span>
                </div>
                {['Đề tài', 'Luận văn', 'Sinh viên'].map((item, i) => (
                    <motion.div key={item}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`text-xs py-1 px-2 rounded ${i === 0 ? 'bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-500'}`}>
                        {item}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )

    if (type === 'finish') return (
        <div className="flex flex-col items-center gap-4">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl">
                🎉
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
            >
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Hoàn tất
                </div>
            </motion.div>
        </div>
    )

    // Default fallback
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl
                      flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-gray-400" />
            </div>
        </div>
    )
}
