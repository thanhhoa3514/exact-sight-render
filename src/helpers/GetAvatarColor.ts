export function GetAvatarColor(id: string) {
    const colors = [
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    ]
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}