import { useState, useEffect } from 'react'
import {
    addMonths,
    subMonths,
    addDays,
    startOfWeek,
    endOfWeek,
    format
} from 'date-fns'

import { CalendarHeader } from '../components/calendar/CalendarHeader'
import { EventLegend } from '../components/calendar/EventLegend'
import { MonthView } from '../components/calendar/MonthView'
import { DayDetailPanel } from '../components/calendar/DayDetailPanel'
import LoadingSpinner from '../components/shared/LoadingSpinner'

import { mockSystemEvents, type PersonalNote } from '../data/calendarData'

export function LichBaoVe() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [notes, setNotes] = useState<PersonalNote[]>([])
    const [loading, setLoading] = useState(true)

    // Calculate upcoming events for the badge
    const upcomingCount = mockSystemEvents.filter(e => {
        const eventDate = new Date(e.date)
        const today = new Date()
        const nextWeek = endOfWeek(today, { weekStartsOn: 1 })
        const startObj = startOfWeek(today, { weekStartsOn: 1 })

        // Quick check if date falls in current week
        return eventDate >= startObj && eventDate <= nextWeek
    }).length

    // Load notes from localStorage on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const storedNotes = localStorage.getItem('personal_notes')
            if (storedNotes) {
                try {
                    setNotes(JSON.parse(storedNotes))
                } catch (e) {
                    console.error('Failed to parse stored notes')
                }
            }
            setLoading(false)
        }, 600)
        return () => clearTimeout(timer)
    }, [])

    // Save notes to localStorage on change
    useEffect(() => {
        localStorage.setItem('personal_notes', JSON.stringify(notes))
    }, [notes])

    // Handle panel interactions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPanelOpen) {
                setIsPanelOpen(false)
                setSelectedDate(null)
            }

            // Navigate days when panel open
            if (isPanelOpen && selectedDate) {
                if (e.key === 'ArrowRight') {
                    setSelectedDate(prev => prev ? addDays(prev, 1) : prev)
                } else if (e.key === 'ArrowLeft') {
                    setSelectedDate(prev => prev ? addDays(prev, -1) : prev)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPanelOpen, selectedDate])

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            setCurrentDate(new Date())
            return
        }

        // Depending on view, shift date. Assuming Month View primarily currently.
        setCurrentDate(curr => direction === 'next' ? addMonths(curr, 1) : subMonths(curr, 1))
    }

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date)
        setIsPanelOpen(true)
    }

    const handleNavigateDay = (days: number) => {
        if (selectedDate) {
            setSelectedDate(addDays(selectedDate, days))
        }
    }

    const handleAddNote = (newNoteData: Omit<PersonalNote, 'id' | 'created_at' | 'updated_at'>) => {
        const note: PersonalNote = {
            ...newNoteData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        setNotes(prev => [...prev, note])
    }

    const handleEditNote = (id: string, content: string) => {
        setNotes(prev => prev.map(n =>
            n.id === id ? { ...n, content, updated_at: new Date().toISOString() } : n
        ))
    }

    const handleDeleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id))
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Đang tải lịch..." />
    }

    return (
        <div className="flex-1 overflow-auto bg-gray-50/50 dark:bg-black p-4 sm:p-6 lg:p-8 isolate relative">
            <div className="max-w-7xl mx-auto flex flex-col h-full min-h-[calc(100vh-4rem)]">

                {/* Header & Controls */}
                <CalendarHeader
                    currentDate={currentDate}
                    view={view}
                    upcomingCount={upcomingCount}
                    onViewChange={setView}
                    onNavigate={handleNavigate}
                    onAddNote={() => {
                        setSelectedDate(new Date())
                        setIsPanelOpen(true)
                    }}
                />

                {/* Legend */}
                <EventLegend />

                {/* Main View Area */}
                <div className="flex-1 flex flex-col">
                    {view === 'month' ? (
                        <MonthView
                            currentDate={currentDate}
                            events={mockSystemEvents}
                            notes={notes}
                            selectedDate={selectedDate}
                            onSelectDate={handleSelectDate}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                View "{view}" đang được phát triển...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Slide-in specific day details panel */}
            {selectedDate && (
                <DayDetailPanel
                    date={selectedDate}
                    isOpen={isPanelOpen}
                    events={mockSystemEvents.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd'))}
                    notes={notes.filter(n => n.date === format(selectedDate, 'yyyy-MM-dd'))}
                    onClose={() => setIsPanelOpen(false)}
                    onNavigateDay={handleNavigateDay}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                />
            )}
        </div>
    )
}
