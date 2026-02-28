import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { TourModalProps, TourShortcut } from './onboarding.types'
import { TourMediaContent } from './TourMediaContent'

export function TourModal({ step, currentIndex, totalSteps, progress, onNext, onPrev, onSkip }: TourModalProps) {
    const isFirst = currentIndex === 0
    const isLast = currentIndex === totalSteps - 1

    return (
        <div className="
      w-[480px] bg-white dark:bg-gray-950
      rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)]
      border border-gray-200/60 dark:border-gray-800
      overflow-hidden
    ">
            {/* ── PROGRESS BAR ── */}
            <div className="h-1 bg-gray-100 dark:bg-gray-800">
                <motion.div
                    className="h-full bg-gray-900 dark:bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>

            {/* ── MEDIA AREA (Animated preview) ── */}
            <div className="relative h-[200px] bg-gray-50 dark:bg-gray-900
                      border-b border-gray-100 dark:border-gray-800
                      overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 1.05, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <TourMediaContent type={step.media} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── TEXT CONTENT ── */}
            <div className="px-6 pt-5 pb-4 min-h-[140px] flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id + '_text'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100
                           tracking-tight leading-snug mb-2">
                            {step.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                            {step.description}
                        </p>

                        {/* Tip chip */}
                        {step.tip && (
                            <div className="mt-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20
                              rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300">{step.tip}</p>
                            </div>
                        )}

                        {/* Keyboard shortcuts (step 'keyboard') */}
                        {step.shortcuts && (
                            <div className="mt-3 space-y-2 max-h-[120px] overflow-y-auto">
                                {step.shortcuts.map((sc: TourShortcut, i: number) => (
                                    <div key={i} className="flex items-center justify-between gap-2 pr-2">
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {sc.keys.map((k: string) => (
                                                <kbd key={k}
                                                    className="px-2 py-0.5 text-xs font-mono font-medium
                                     bg-gray-100 dark:bg-gray-800
                                     border border-gray-300 dark:border-gray-600
                                     rounded-md text-gray-700 dark:text-gray-300
                                     shadow-[0_1px_0_rgba(0,0,0,0.15)] whitespace-nowrap">
                                                    {k}
                                                </kbd>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500 line-clamp-2">{sc.desc}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── FOOTER: Navigation ── */}
            <div className="px-6 pb-5 flex items-center justify-between">
                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                width: i === currentIndex ? 20 : 6,
                                backgroundColor: i === currentIndex
                                    ? '#111827'
                                    : i < currentIndex ? '#9CA3AF' : '#E5E7EB',
                            }}
                            transition={{ duration: 0.25 }}
                            className="h-1.5 rounded-full dark:bg-gray-600"
                            style={{
                                backgroundColor: i === currentIndex
                                    ? 'currentColor'
                                    : undefined
                            }}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    {/* Skip (chỉ hiện ở bước đầu) */}
                    {isFirst && (
                        <button onClick={onSkip}
                            className="text-sm text-gray-400 hover:text-gray-600
                         transition-colors px-2 py-1.5">
                            Bỏ qua
                        </button>
                    )}

                    {/* Back */}
                    {!isFirst && (
                        <button onClick={onPrev}
                            className="flex items-center gap-1.5 text-sm text-gray-500
                         hover:text-gray-900 dark:hover:text-gray-100
                         px-3 py-2 rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors duration-150">
                            <ChevronLeft className="w-4 h-4" />
                            Quay lại
                        </button>
                    )}

                    {/* Next / Finish */}
                    <motion.button
                        onClick={onNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-1.5 text-sm font-medium
                       bg-gray-900 dark:bg-white
                       text-white dark:text-gray-900
                       px-4 py-2 rounded-lg
                       hover:bg-gray-700 dark:hover:bg-gray-100
                       transition-colors duration-150"
                    >
                        {isLast ? (
                            <><Check className="w-4 h-4" /> Bắt đầu sử dụng</>
                        ) : (
                            <>Tiếp theo <ChevronRight className="w-4 h-4" /></>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
