import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    CalendarDays,
    CalendarRange,
    Calendar,
    List
} from 'lucide-react'
import { UpcomingBadge } from './UpcomingBadge'

interface CalendarHeaderProps {
    currentDate: Date
    view: 'month' | 'week' | 'day' | 'agenda'
    upcomingCount?: number
    onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void
    onNavigate: (direction: 'prev' | 'next' | 'today') => void
    onAddNote: () => void
}

export function CalendarHeader({
    currentDate,
    view,
    upcomingCount = 0,
    onViewChange,
    onNavigate,
    onAddNote,
}: CalendarHeaderProps) {
    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Title row */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Lịch
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Theo dõi lịch bảo vệ, deadline và ghi chú cá nhân
                    </p>
                </div>
                <button
                    onClick={onAddNote}
                    className="flex items-center gap-2 bg-gray-900 dark:bg-white
                     text-white dark:text-gray-900 px-4 py-2 rounded-lg
                     text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors
                     active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" /> Thêm ghi chú
                </button>
            </div>

            {/* Navigation + View Toggle row */}
            <div className="flex items-center justify-between">
                {/* Month navigation */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('prev')}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    <motion.h2
                        key={format(currentDate, 'yyyy-MM')}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-44 text-center capitalize"
                    >
                        {format(currentDate, 'MMMM, yyyy', { locale: vi })}
                    </motion.h2>

                    <button
                        onClick={() => onNavigate('next')}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    <button
                        onClick={() => onNavigate('today')}
                        className="text-sm text-gray-500 hover:text-gray-900
                       dark:text-gray-400 dark:hover:text-gray-100 px-3 py-1.5 rounded-lg
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ml-2"
                    >
                        Hôm nay
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Upcoming alerts badge */}
                    <UpcomingBadge count={upcomingCount} onClick={() => onViewChange('agenda')} />

                    {/* View toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800
                          rounded-lg p-1 gap-0.5">
                        {[
                            { key: 'month', label: 'Tháng', icon: CalendarDays },
                            { key: 'week', label: 'Tuần', icon: CalendarRange },
                            { key: 'day', label: 'Ngày', icon: Calendar },
                            { key: 'agenda', label: 'DS', icon: List },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => onViewChange(key as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md
                            text-xs font-medium transition-all duration-150 ${view === key
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
