import { Bell } from 'lucide-react'

export function UpcomingBadge({ count, onClick }: { count: number; onClick: () => void }) {
    if (count === 0) return null

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5
                 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300
                 border border-amber-200 dark:border-amber-800/50
                 rounded-lg text-xs font-medium hover:bg-amber-100 
                 dark:hover:bg-amber-900/40 transition-colors"
        >
            <Bell className="w-3.5 h-3.5" />
            {count} sự kiện tuần này
        </button>
    )
}
