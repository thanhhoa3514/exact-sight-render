export const GetStatusColor = (status: string) => {
    switch (status) {
        case 'Chờ diễn ra': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        case 'Đang diễn ra': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        case 'Đã hoàn thành': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
        case 'Cần chú ý': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        default: return 'bg-muted text-muted-foreground border-border/50'
    }
}