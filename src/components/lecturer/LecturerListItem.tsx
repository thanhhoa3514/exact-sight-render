import { ChevronRight } from 'lucide-react'
import type { Lecturer } from '../../data/lecturerData'
import { InitialName } from '@/helpers/InitialName'



const getAvatarColor = (id: string) => {
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

interface LecturerListItemProps {
    lecturer: Lecturer;
    onClick: () => void;
}

export function LecturerListItem({ lecturer, onClick }: LecturerListItemProps) {
    const capacityPct = lecturer.sv_toi_da > 0
        ? (lecturer.sv_hien_tai / lecturer.sv_toi_da) * 100
        : 0

    const isOverloaded = capacityPct > 100
    const isNearFull = capacityPct >= 80

    return (
        <div onClick={onClick}
            className="group flex flex-col sm:flex-row items-center gap-4 px-5 py-4
                 border-b border-gray-100 dark:border-gray-800
                 hover:bg-gray-50/80 dark:hover:bg-gray-800/40
                 cursor-pointer transition-colors duration-100 relative"
        >
            <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-gray-900 dark:bg-gray-100
                       scale-y-0 group-hover:scale-y-100
                       transition-transform duration-150 rounded-full" />

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                       text-sm font-bold shrink-0 ${getAvatarColor(lecturer.id)} hidden sm:flex`}>
                {InitialName(lecturer.name)}
            </div>

            {/* Info Container */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {lecturer.hoc_vi && `${lecturer.hoc_vi} `}
                        {lecturer.name}
                    </span>
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{lecturer.ma_gv}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                           px-1.5 py-0.5 rounded-md truncate max-w-[120px]">{lecturer.bo_mon}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {lecturer.expertise.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800
                                       text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                    {lecturer.expertise.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{lecturer.expertise.length - 3}</span>
                    )}
                </div>
            </div>

            {/* Stats - Hidden on very small screens, shown as row on slightly larger */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 shrink-0 mt-3 sm:mt-0">
                <div className="flex items-center gap-6 text-center">
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {lecturer.sv_hien_tai}
                        </p>
                        <p className="text-[10px] text-gray-400">SV</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {lecturer.hoi_dong_count}
                        </p>
                        <p className="text-[10px] text-gray-400">HĐ</p>
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${lecturer.gio_nghia_vu >= lecturer.gio_nghia_vu_dinh_muc
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-900 dark:text-gray-100'
                            }`}>
                            {lecturer.gio_nghia_vu}h
                        </p>
                        <p className="text-[10px] text-gray-400">NV</p>
                    </div>
                </div>

                {/* Capacity */}
                <div className="w-28 shrink-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">
                            {lecturer.sv_hien_tai}/{lecturer.sv_toi_da}
                        </span>
                        <span className={`text-[10px] font-bold ${isOverloaded ? 'text-red-600 dark:text-red-400' : isNearFull ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                            }`}>
                            {Math.round(capacityPct)}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isOverloaded ? 'bg-red-500' : isNearFull ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                            style={{ width: `${Math.min(capacityPct, 100)}%` }}
                        />
                    </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-300
                                 group-hover:translate-x-0.5 transition-all duration-150 hidden sm:block" />
            </div>
        </div>
    )
}
