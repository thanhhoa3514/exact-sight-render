import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { Plus, CalendarDays, StickyNote } from 'lucide-react'
import { type CalendarEvent, type PersonalNote } from '../../data/calendarData'
import { DayDetailPanelHeader } from './DayDetailPanelHeader'
import { NoteCard } from './NoteCardComponent'
import { AddNoteForm } from './AddNoteForm'
import { SystemEventCard } from './SystemEventCard'

interface DayDetailPanelProps {
    date: Date
    events: CalendarEvent[]
    notes: PersonalNote[]
    isOpen: boolean
    onClose: () => void
    onNavigateDay: (days: number) => void
    onAddNote: (note: Omit<PersonalNote, 'id' | 'created_at' | 'updated_at'>) => void
    onEditNote: (id: string, content: string) => void
    onDeleteNote: (id: string) => void
}

export function DayDetailPanel({
    date,
    events,
    notes,
    isOpen,
    onClose,
    onNavigateDay,
    onAddNote,
    onEditNote,
    onDeleteNote
}: DayDetailPanelProps) {
    const [noteInput, setNoteInput] = useState('')
    const [isAddingNote, setIsAddingNote] = useState(false)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[440px] z-[101] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-[-8px_0_40px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
                    >
                        <DayDetailPanelHeader
                            date={date}
                            onClose={onClose}
                            onNavigateDay={onNavigateDay}
                        />

                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                            <section>
                                <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                                    <CalendarDays className="w-4 h-4" />
                                    Sự kiện hệ thống
                                </h3>

                                {events.length > 0 ? (
                                    <div className="space-y-3">
                                        {events.map((event) => (
                                            <SystemEventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                                        <CalendarDays className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Không có sự kiện hệ thống</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Các sự kiện về luận văn, đề tài sẽ hiện ở đây</p>
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        <StickyNote className="w-4 h-4" />
                                        Ghi chú cá nhân
                                    </h3>
                                    <button
                                        onClick={() => setIsAddingNote(true)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence initial={false}>
                                        {notes.map((note) => (
                                            <motion.div
                                                key={note.id}
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <NoteCard
                                                    note={note}
                                                    onEdit={(content) => onEditNote(note.id, content)}
                                                    onDelete={() => onDeleteNote(note.id)}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence>
                                    {isAddingNote && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-3 overflow-hidden origin-top"
                                        >
                                            <AddNoteForm
                                                date={date}
                                                onSave={(content, color) => {
                                                    onAddNote({
                                                        date: format(date, 'yyyy-MM-dd'),
                                                        content,
                                                        color: color as PersonalNote['color']
                                                    })
                                                    setIsAddingNote(false)
                                                }}
                                                onCancel={() => setIsAddingNote(false)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {notes.length === 0 && !isAddingNote && (
                                    <button
                                        onClick={() => setIsAddingNote(true)}
                                        className="w-full mt-2 py-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-transparent text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all flex flex-col items-center justify-center gap-2 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        Thêm ghi chú cho ngày này
                                    </button>
                                )}
                            </section>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 shrink-0">
                            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 text-center flex items-center justify-center gap-3">
                                <span><kbd className="font-sans px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mr-1 shadow-sm">ESC</kbd> đóng</span>
                                <span>•</span>
                                <span><kbd className="font-sans px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold mr-0.5 shadow-sm">←</kbd> <kbd className="font-sans px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold ml-0.5 shadow-sm">→</kbd> chuyển ngày</span>
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
