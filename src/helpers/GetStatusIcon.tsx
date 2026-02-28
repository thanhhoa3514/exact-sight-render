import { Clock, PlayCircle, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'

export const GetStatusIcon = (status: string, className: string = "w-3.5 h-3.5 mr-1") => {
    switch (status) {
        case 'Chờ diễn ra': return <Clock className={className} />
        case 'Đang diễn ra': return <PlayCircle className={className} />
        case 'Đã hoàn thành': return <CheckCircle2 className={className} />
        case 'Cần chú ý': return <AlertCircle className={className} />
        default: return <HelpCircle className={className} />
    }
}
