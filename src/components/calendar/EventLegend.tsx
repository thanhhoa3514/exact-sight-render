import { EVENT_TYPES } from '../../data/calendarData'

export function EventLegend() {
    return (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
            {Object.entries(EVENT_TYPES).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${config.color}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{config.label}</span>
                </div>
            ))}
        </div>
    )
}
