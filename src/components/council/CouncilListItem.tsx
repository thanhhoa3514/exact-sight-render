import { ChevronRight, Calendar, Users, GraduationCap } from 'lucide-react'
import type { Council } from '../../data/councilData'
import { InitialName } from '@/helpers/InitialName'
import getColor from '@/helpers/GetColor'
import { GetStatusColor } from '@/helpers/GetStatusColor'
import { GetStatusIcon } from '@/helpers/GetStatusIcon'

interface CouncilListItemProps {
    council: Council;
    onClick: (council: Council) => void;
}

export function CouncilListItem({ council, onClick }: CouncilListItemProps) {
    const progressPercent = council.sessions_total > 0
        ? Math.min(100, Math.max(0, Math.round((council.sessions_completed / council.sessions_total) * 100)))
        : 0

    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick(council)
                }
            }}
            onClick={() => onClick(council)}
            className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:bg-muted/20 transition-all cursor-pointer group flex items-center gap-4 sm:gap-6"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                        {council.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded border flex items-center whitespace-nowrap ${GetStatusColor(council.status)}`}>
                        {GetStatusIcon(council.status)}
                        <span className="hidden sm:inline">{council.status}</span>
                    </span>
                </div>
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 gap-y-2">
                    <span className="flex items-center">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-[150px]">{council.field}</span>
                    </span>
                    <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(council.date).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center hidden sm:flex">
                        <Users className="w-3 h-3 mr-1" />
                        {council.members.length} Thành viên
                    </span>
                </div>
            </div>

            <div className="hidden md:block w-48 shrink-0">
                <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium">{council.sessions_completed}/{council.sessions_total}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="hidden lg:flex flex-col items-end w-32 shrink-0">
                <div className="flex -space-x-1.5">
                    {council.members.slice(0, 4).map((member, i) => (
                        <div
                            key={member.id}
                            className={`w-6 h-6 rounded-full border border-background flex items-center justify-center text-[10px] font-medium text-white shadow-sm ${getColor(member.name)}`}
                            title={`${member.role}: ${member.name}`}
                            style={{ zIndex: 10 - i }}
                        >
                            {InitialName(member.name)}
                        </div>
                    ))}
                    {council.members.length > 4 && (
                        <div className="w-6 h-6 rounded-full border border-background flex items-center justify-center text-[10px] font-medium bg-muted text-muted-foreground shadow-sm" style={{ zIndex: 1 }}>
                            +{council.members.length - 4}
                        </div>
                    )}
                </div>
            </div>

            <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                <ChevronRight className="w-5 h-5" />
            </div>
        </div>
    )
}
