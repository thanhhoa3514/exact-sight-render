import { motion, AnimatePresence } from 'framer-motion'
import { format, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface DayDetailPanelHeaderProps {
  date: Date
  onClose: () => void
  onNavigateDay: (days: number) => void
}

export function DayDetailPanelHeader({
  date,
  onClose,
  onNavigateDay
}: DayDetailPanelHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <X className="w-4 h-4" /> Đóng
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigateDay(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onNavigateDay(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={format(date, 'yyyy-MM-dd')}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
              {format(date, 'EEEE', { locale: vi })}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
              {format(date, 'd MMMM, yyyy', { locale: vi })}
              {isSameDay(date, new Date()) && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/50 tracking-wide uppercase relative top-[-1px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Hôm nay
                </span>
              )}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
