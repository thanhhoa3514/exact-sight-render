import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
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

interface LecturerCardProps {
    lecturer: Lecturer;
    onClick: () => void;
}

export function LecturerCard({ lecturer, onClick }: LecturerCardProps) {
    const capacityPct = lecturer.sv_toi_da > 0
        ? (lecturer.sv_hien_tai / lecturer.sv_toi_da) * 100
        : 0

    const isOverloaded = lecturer.sv_hien_tai > lecturer.sv_toi_da
    const isNearFull = capacityPct >= 80 && !isOverloaded
    const hasNoAssignment = lecturer.sv_hien_tai === 0 && lecturer.hoi_dong_count === 0

    const capacityColor = isOverloaded
        ? 'bg-red-500'
        : isNearFull
            ? 'bg-amber-500'
            : 'bg-emerald-500'

    const borderColor = isOverloaded
        ? 'border-red-200 dark:border-red-900/50'
        : hasNoAssignment
            ? 'border-dashed border-gray-300 dark:border-gray-700'
            : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'

    return (
        <div
            onClick={onClick}
            className={`
        group relative bg-white dark:bg-gray-900 rounded-xl p-5
        border cursor-pointer transition-all duration-150 ease-out
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]
        active:scale-[0.99] ${borderColor}
      `}
        >
            {/* Overload badge */}
            {isOverloaded && (
                <span className="absolute top-3 right-3 flex items-center gap-1
                         text-[10px] font-bold text-red-600 dark:text-red-400
                         bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md
                         border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-3 h-3" /> Quá tải
                </span>
            )}

            {/* ── AVATAR + NAME ── */}
            <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center
                         text-base font-bold shrink-0 ring-2 ring-white dark:ring-gray-900
                         ${getAvatarColor(lecturer.id)}`}>
                    {InitialName(lecturer.name)}
                </div>
                <div className="flex-1 min-w-0 pr-16 /* padding for badge */">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100
                         text-sm tracking-[-0.01em] leading-tight truncate">
                        {lecturer.hoc_vi && (
                            <span className="text-gray-400 font-normal mr-1">{lecturer.hoc_vi}</span>
                        )}
                        {lecturer.hoc_ham && (
                            <span className="text-gray-400 font-normal mr-1">{lecturer.hoc_ham}.</span>
                        )}
                        {lecturer.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{lecturer.bo_mon}</p>
                    <p className="font-mono text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">{lecturer.ma_gv}</p>
                </div>
            </div>

            {/* ── EXPERTISE TAGS ── */}
            <div className="flex flex-wrap gap-1 mb-4 h-5 overflow-hidden">
                {lecturer.expertise.slice(0, 3).map(tag => (
                    <span key={tag}
                        className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800
                       text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md">
                        {tag}
                    </span>
                ))}
                {lecturer.expertise.length > 3 && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 py-0.5">+{lecturer.expertise.length - 3}</span>
                )}
            </div>

            {/* ── DIVIDER ── */}
            <div className="border-t border-gray-100 dark:border-gray-800 mb-3" />

            {/* ── ACTIVITY STATS ── */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {lecturer.sv_hien_tai}
                    </p>
                    <p className="text-[10px] text-gray-400">SV HD</p>
                </div>
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {lecturer.hoi_dong_count}
                    </p>
                    <p className="text-[10px] text-gray-400">Hội đồng</p>
                </div>
                <div>
                    <p className={`text-base font-bold ${lecturer.gio_nghia_vu >= lecturer.gio_nghia_vu_dinh_muc
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-900 dark:text-gray-100'
                        }`}>
                        {lecturer.gio_nghia_vu}
                    </p>
                    <p className="text-[10px] text-gray-400">Giờ NV</p>
                </div>
            </div>

            {/* ── CAPACITY BAR ── */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">Công suất HD</span>
                    <span className={`text-[10px] font-semibold ${isOverloaded ? 'text-red-600 dark:text-red-400' : isNearFull ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {lecturer.sv_hien_tai}/{lecturer.sv_toi_da} SV
                        {isNearFull && ' ⚠'}
                        {isOverloaded && ' ✗'}
                    </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(capacityPct, 100)}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`h-full rounded-full ${capacityColor}`}
                    />
                </div>
            </div>
        </div>
    )
}
