import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    format
} from 'date-fns'
import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { EVENT_TYPES, type CalendarEvent, type PersonalNote } from '../../data/calendarData'

// Helper to chunk days into weeks (7 days each)
function chunkWeeks(days: Date[]): Date[][] {
    const weeks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }
    return weeks
}

interface MonthViewProps {
    currentDate: Date
    events: CalendarEvent[]
    notes: PersonalNote[]
    selectedDate: Date | null
    onSelectDate: (date: Date) => void
}

export function MonthView({ currentDate, events, notes, selectedDate, onSelectDate }: MonthViewProps) {
    const startMonth = startOfMonth(currentDate)
    const endMonth = endOfMonth(currentDate)
    const startDate = startOfWeek(startMonth, { weekStartsOn: 1 }) // Monday start
    const endDate = endOfWeek(endMonth, { weekStartsOn: 1 })

    const daysInView = eachDayOfInterval({ start: startDate, end: endDate })
    const weeks = chunkWeeks(daysInView)

    const getEventsForDay = (day: Date) => {
        const dayStr = format(day, 'yyyy-MM-dd')
        return events.filter(e => e.date === dayStr)
    }

    const getNotesForDay = (day: Date) => {
        const dayStr = format(day, 'yyyy-MM-dd')
        return notes.filter(n => n.date === dayStr)
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border
                    border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div
                        key={day}
                        className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400
                       uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Weeks grid */}
            {weeks.map((week, wi) => (
                <div
                    key={wi}
                    className="grid grid-cols-7 border-b last:border-b-0
                     border-gray-100 dark:border-gray-800"
                >
                    {week.map((day, di) => {
                        const dayEvents = getEventsForDay(day)
                        const dayNotes = getNotesForDay(day)
                        const isToday = isSameDay(day, new Date())
                        const isSelected = selectedDate && isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const totalItems = dayEvents.length + dayNotes.length

                        // Heat map logic for busy days
                        const heatLevel = Math.min(totalItems, 4)

                        return (
                            <motion.div
                                key={di}
                                onClick={() => onSelectDate(day)}
                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                className={`
                  min-h-[110px] p-2 cursor-pointer border-r last:border-r-0
                  border-gray-100 dark:border-gray-800 transition-colors relative
                  ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-950/50' : ''}
                  ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-inset ring-indigo-500 dark:ring-indigo-400 z-10' : ''}
                  ${heatLevel >= 3 && !isSelected && isCurrentMonth ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}
                `}
                            >
                                {/* Date number */}
                                <div className="flex items-center justify-between mb-1.5">
                                    <span
                                        className={`
                      w-7 h-7 flex items-center justify-center rounded-full
                      text-sm font-medium transition-colors
                      ${isToday
                                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                                : !isCurrentMonth
                                                    ? 'text-gray-400 dark:text-gray-600'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }
                    `}
                                    >
                                        {format(day, 'd')}
                                    </span>

                                    {/* Personal note indicator dot */}
                                    {dayNotes.length > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                                    )}
                                </div>

                                {/* Events list (Max 2 displayed, rest hidden behind a count) */}
                                <div className="space-y-1">
                                    {dayEvents.slice(0, 2).map((event, ei) => (
                                        <DayEventChip key={ei} event={event} />
                                    ))}

                                    {dayEvents.length > 2 && (
                                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 pl-1 block">
                                            +{dayEvents.length - 2} sự kiện
                                        </span>
                                    )}

                                    {/* Notes preview (Max 1 displayed) */}
                                    {dayNotes.slice(0, 1).map((note, ni) => (
                                        <NoteChip key={ni} note={note} />
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

function DayEventChip({ event }: { event: CalendarEvent }) {
    const config = EVENT_TYPES[event.type]
    if (!config) return null // Type fallback

    return (
        <div
            className={`
        flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium
        truncate leading-snug border ${config.lightBg} ${config.textColor} ${config.borderColor}
      `}
            title={event.title}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} />
            <span className="truncate">{event.title}</span>
        </div>
    )
}

function NoteChip({ note }: { note: PersonalNote }) {
    return (
        <div
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium
                 truncate leading-snug border border-dashed border-gray-300 dark:border-gray-600
                 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30"
            title={note.content}
        >
            <Pencil className="w-2.5 h-2.5 shrink-0 opacity-70" />
            <span className="truncate">{note.content}</span>
        </div>
    )
}
