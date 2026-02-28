import { Clock } from 'lucide-react'
import { EVENT_TYPES, type CalendarEvent } from '../../data/calendarData'

export function SystemEventCard({ event }: { event: CalendarEvent }) {
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
