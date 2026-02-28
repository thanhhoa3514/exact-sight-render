import { Shield, AlertCircle, Clock, Users, Award, StickyNote, type LucideIcon } from 'lucide-react'

export interface EventConfig {
    label: string
    color: string
    lightBg: string
    textColor: string
    borderColor: string
    dotColor: string
    icon: LucideIcon
}

export type EventType = 'bao_ve' | 'deadline_nop' | 'deadline_tien_do' | 'meeting' | 'ket_qua' | 'note'

export const EVENT_TYPES: Record<EventType, EventConfig> = {
    bao_ve: {
        label: 'Lịch bảo vệ',
        color: 'bg-violet-500',
        lightBg: 'bg-violet-50 dark:bg-violet-900/20',
        textColor: 'text-violet-700 dark:text-violet-300',
        borderColor: 'border-violet-200 dark:border-violet-800',
        dotColor: 'bg-violet-500',
        icon: Shield,
    },
    deadline_nop: {
        label: 'Deadline nộp LV',
        color: 'bg-red-500',
        lightBg: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800',
        dotColor: 'bg-red-500',
        icon: AlertCircle,
    },
    deadline_tien_do: {
        label: 'Mốc tiến độ',
        color: 'bg-amber-500',
        lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
        icon: Clock,
    },
    meeting: {
        label: 'Cuộc họp / Gặp SV',
        color: 'bg-blue-500',
        lightBg: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800',
        dotColor: 'bg-blue-500',
        icon: Users,
    },
    ket_qua: {
        label: 'Công bố kết quả',
        color: 'bg-emerald-500',
        lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        dotColor: 'bg-emerald-500',
        icon: Award,
    },
    note: {
        label: 'Ghi chú cá nhân',
        color: 'bg-gray-400',
        lightBg: 'bg-gray-50 dark:bg-gray-800/50',
        textColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-200 dark:border-gray-700',
        dotColor: 'bg-gray-400',
        icon: StickyNote,
    },
}

export interface EventMeta {
    council_id?: string
    thesis_count?: number
    students?: string[]
    affected_students?: number
    milestone_id?: string
    public?: boolean
}

export interface CalendarEvent {
    id: string
    type: EventType
    title: string
    date: string // 'yyyy-MM-dd'
    time_start?: string // 'HH:mm'
    time_end?: string
    location?: string
    meta?: EventMeta
}

export interface PersonalNote {
    id: string
    date: string // 'yyyy-MM-dd'
    content: string
    color: 'gray' | 'yellow' | 'blue' | 'green' | 'red'
    created_at: string
    updated_at: string
}

// Lấy ngày hôm nay theo format yyyy-MM-dd
const todayStr = new Date().toISOString().split('T')[0]
// Lấy ngày tuần sau
const nextWeekDate = new Date()
nextWeekDate.setDate(nextWeekDate.getDate() + 7)
const nextWeekStr = nextWeekDate.toISOString().split('T')[0]
// Lấy ngày tuần trước
const prevWeekDate = new Date()
prevWeekDate.setDate(prevWeekDate.getDate() - 3)
const prevWeekStr = prevWeekDate.toISOString().split('T')[0]

export const mockSystemEvents: CalendarEvent[] = [
    {
        id: '1',
        type: 'bao_ve',
        title: 'Lịch bảo vệ HĐ-01',
        date: todayStr,
        time_start: '08:00',
        time_end: '12:00',
        location: 'P.A101',
        meta: { council_id: 'hd-01', thesis_count: 4 },
    },
    {
        id: '1b',
        type: 'meeting',
        title: 'Họp với sinh viên hướng dẫn',
        date: todayStr,
        time_start: '14:00',
        time_end: '16:00',
        location: 'VP Khoa',
        meta: { students: ['Bảo', 'Vy'] },
    },
    {
        id: '2',
        type: 'deadline_nop',
        title: 'Deadline nộp bản nháp',
        date: nextWeekStr,
        meta: { affected_students: 3 },
    },
    {
        id: '3',
        type: 'deadline_tien_do',
        title: 'Mốc tiến độ: Báo cáo tuần 8',
        date: prevWeekStr,
        meta: { milestone_id: 'moc-08' },
    },
    {
        id: '4',
        type: 'ket_qua',
        title: 'Công bố điểm bảo vệ đợt 1',
        date: nextWeekStr,
        meta: { public: true },
    }
]
