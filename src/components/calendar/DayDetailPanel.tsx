import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isSameDay, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    X,
    ChevronLeft,
    ChevronRight,
    Plus,
    CalendarDays,
    StickyNote,
    Pencil,
    Trash2,
    Check,
    Clock
} from 'lucide-react'
import { EVENT_TYPES, type CalendarEvent, type PersonalNote } from '../../data/calendarData'

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
                    <motion.div /* backdrop */
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    <motion.div /* panel */
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[440px] z-[101]
                       bg-white dark:bg-gray-950
                       border-l border-gray-200 dark:border-gray-800
                       shadow-[-8px_0_40px_rgba(0,0,0,0.12)]
                       flex flex-col overflow-hidden"
                    >
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-4
                            border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm text-gray-500
                           hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4" /> Đóng
                            </button>
                            {/* Navigate prev/next day */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onNavigateDay(-1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                    onClick={() => onNavigateDay(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Date Title */}
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
                                            <span className="inline-flex items-center gap-1.5
                                       text-[10px] font-bold text-indigo-700 dark:text-indigo-300
                                       bg-indigo-50 dark:bg-indigo-900/40
                                       px-2.5 py-1 rounded-full border
                                       border-indigo-200/50 dark:border-indigo-800/50
                                       tracking-wide uppercase relative top-[-1px]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                Hôm nay
                                            </span>
                                        )}
                                    </h2>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                            {/* System Events Section */}
                            <section>
                                <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase
                               tracking-wider mb-4">
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

                            {/* Personal Notes Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        <StickyNote className="w-4 h-4" />
                                        Ghi chú cá nhân
                                    </h3>
                                    <button
                                        onClick={() => setIsAddingNote(true)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                               hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors
                               bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm
                                    </button>
                                </div>

                                {/* Existing Notes */}
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

                                {/* Add Note Form */}
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
                                                        color: color as any
                                                    })
                                                    setIsAddingNote(false)
                                                }}
                                                onCancel={() => setIsAddingNote(false)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Prompt to add if empty and not in add mode */}
                                {notes.length === 0 && !isAddingNote && (
                                    <button
                                        onClick={() => setIsAddingNote(true)}
                                        className="w-full mt-2 py-6 border-2 border-dashed
                               border-gray-200 dark:border-gray-800 rounded-xl bg-transparent
                               text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                               hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50
                               transition-all flex flex-col items-center justify-center gap-2 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        Thêm ghi chú cho ngày này
                                    </button>
                                )}
                            </section>
                        </div>

                        {/* Footer keyboard hint */}
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

function SystemEventCard({ event }: { event: CalendarEvent }) {
    const config = EVENT_TYPES[event.type]
    if (!config) return null
    const Icon = config.icon

    return (
        <div className={`rounded-xl border p-4 ${config.lightBg} ${config.borderColor}`}>
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${config.textColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className={`text-sm font-bold ${config.textColor} mb-1`}>
                        {event.title}
                    </h4>

                    <div className="space-y-1 mt-2">
                        {event.time_start && (
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 opacity-70" />
                                {event.time_start} {event.time_end ? `- ${event.time_end}` : ''}
                            </p>
                        )}

                        {/* Meta rendering based on type */}
                        {event.type === 'bao_ve' && event.meta && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {event.location && <span className="font-medium mr-1.5">{event.location} &bull;</span>}
                                {event.meta.thesis_count} luận văn
                            </p>
                        )}

                        {event.type === 'deadline_nop' && event.meta && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                                Ảnh hưởng {event.meta.affected_students} sinh viên
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AddNoteForm({ date, onSave, onCancel }: any) {
    const [content, setContent] = useState('')
    const [color, setColor] = useState('yellow') // default bright color

    const NOTE_COLORS = [
        { key: 'yellow', bg: 'bg-amber-300', border: 'border-amber-400' },
        { key: 'blue', bg: 'bg-blue-300', border: 'border-blue-400' },
        { key: 'green', bg: 'bg-emerald-300', border: 'border-emerald-400' },
        { key: 'red', bg: 'bg-red-300', border: 'border-red-400' },
        { key: 'gray', bg: 'bg-gray-300 dark:bg-gray-600', border: 'border-gray-400 dark:border-gray-500' },
    ]

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border
                    border-gray-200 dark:border-gray-700 p-4 shadow-sm relative overflow-hidden">

            {/* Decorative colored strip matching selected color */}
            <div className={`absolute top-0 left-0 w-full h-1 ${NOTE_COLORS.find(c => c.key === color)?.bg}`} />

            {/* Textarea */}
            <textarea
                autoFocus
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        if (content.trim()) onSave(content, color)
                    }
                }}
                placeholder="Nhập ghi chú của bạn (Cmd/Ctrl + Enter để lưu)..."
                rows={3}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none outline-none
                   leading-relaxed mt-1"
            />

            {/* Color picker + actions */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Color dots */}
                <div className="flex items-center gap-2">
                    {NOTE_COLORS.map(c => (
                        <button
                            key={c.key}
                            onClick={() => setColor(c.key)}
                            title={`Màu ${c.key}`}
                            className={`w-5 h-5 rounded-full ${c.bg} transition-all border ${c.border}
                          ${color === c.key
                                    ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900 scale-110 shadow-sm'
                                    : 'hover:scale-110 opacity-70 hover:opacity-100'
                                }`}
                        />
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-1.5
                       transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => content.trim() && onSave(content, color)}
                        disabled={!content.trim()}
                        className="flex items-center gap-1.5 text-xs font-bold
                       bg-indigo-600 text-white
                       px-4 py-1.5 rounded-lg transition-all shadow-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-indigo-700 hover:shadow
                       active:scale-[0.98]"
                    >
                        <Check className="w-3.5 h-3.5" /> Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

function NoteCard({ note, onEdit, onDelete }: any) {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(note.content)

    const colorMap: Record<string, string> = {
        yellow: 'bg-[#fff9c4] dark:bg-amber-900/30 border-[#fff176] dark:border-amber-700/50 text-amber-900 dark:text-amber-100',
        blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50 text-blue-900 dark:text-blue-100',
        green: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50 text-emerald-900 dark:text-emerald-100',
        red: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50 text-red-900 dark:text-red-100',
        gray: 'bg-gray-100 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200',
    }

    const dotColorMap: Record<string, string> = {
        yellow: 'bg-amber-400',
        blue: 'bg-blue-400',
        green: 'bg-emerald-400',
        red: 'bg-red-400',
        gray: 'bg-gray-400',
    }

    const themeClasses = colorMap[note.color] ?? colorMap.yellow
    const dotColor = dotColorMap[note.color] ?? dotColorMap.yellow

    return (
        <div className={`rounded-xl border shadow-sm relative overflow-hidden group ${themeClasses}`}>
            {/* Decorative left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${dotColor}`} />

            <div className="p-3.5 pl-4">
                <div className="flex items-start justify-between gap-3">
                    {isEditing ? (
                        <div className="flex-1 w-full relative">
                            <textarea
                                autoFocus
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        onEdit(editContent); setIsEditing(false)
                                    }
                                    if (e.key === 'Escape') {
                                        setEditContent(note.content); setIsEditing(false)
                                    }
                                }}
                                className="w-full text-sm bg-white/50 dark:bg-black/20 p-2 rounded-md
                           outline-none resize-none ring-1 ring-black/10 dark:ring-white/10"
                                rows={3}
                            />
                            <div className="flex gap-1 mt-2 justify-end">
                                <button onClick={() => { setEditContent(note.content); setIsEditing(false) }}
                                    className="px-2 py-1 text-[10px] font-medium bg-black/5 dark:bg-white/10 rounded hover:bg-black/10 transition-colors">
                                    Hủy
                                </button>
                                <button onClick={() => { onEdit(editContent); setIsEditing(false) }}
                                    className="px-2 py-1 text-[10px] font-bold bg-black/80 dark:bg-white text-white dark:text-black rounded hover:bg-black transition-colors">
                                    Lưu (Cmd+Ent)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium leading-relaxed flex-1 whitespace-pre-wrap">
                                {note.content}
                            </p>

                            <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setIsEditing(true)}
                                    className="w-7 h-7 flex items-center justify-center rounded-md
                             text-current opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10
                             transition-all">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={onDelete}
                                    className="w-7 h-7 flex items-center justify-center rounded-md
                             text-red-500 dark:text-red-400 opacity-60 hover:opacity-100 hover:bg-red-50 
                             dark:hover:bg-red-900/30 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {!isEditing && (
                    <p className="text-[10px] font-medium opacity-50 mt-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(note.created_at || new Date()), 'HH:mm · dd/MM/yyyy')}
                    </p>
                )}
            </div>
        </div>
    )
}
