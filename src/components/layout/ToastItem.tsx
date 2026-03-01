import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATION_TYPES_CONFIG } from '@/data/notificationData';
import type { Toast } from '@/contexts/NotificationContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();
    const controls = useAnimation();

    const [timeAgo, setTimeAgo] = useState(() =>
        formatDistanceToNowStrict(toast.createdAt, { addSuffix: true, locale: vi })
    );

    useEffect(() => {
        // Start the countdown on mount
        controls.start({
            scaleX: 0,
            transition: { duration: 5, ease: 'linear' }
        });
    }, [controls]);

    useEffect(() => {
        if (isPaused) {
            // Check for newer framer-motion play/pause API, fallback to stop/start
            const ctrl = controls as unknown as { pause?: () => void };
            if (typeof ctrl.pause === 'function') {
                ctrl.pause();
            } else {
                controls.stop();
            }
        } else {
            const ctrl = controls as unknown as { play?: () => void };
            if (typeof ctrl.play === 'function') {
                ctrl.play();
            } else {
                // Notice: starting again will animate the rest but won't perfectly track time unless we do it manually,
                // but this supports older framer-motion versions safely.
                controls.start({ scaleX: 0, transition: { duration: 5, ease: 'linear' } });
            }
        }
    }, [isPaused, controls]);

    // Update "time ago" string every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeAgo(formatDistanceToNowStrict(toast.createdAt, { addSuffix: true, locale: vi }));
        }, 60000);
        return () => clearInterval(intervalId);
    }, [toast.createdAt]);

    const config = NOTIFICATION_TYPES_CONFIG[toast.type] || NOTIFICATION_TYPES_CONFIG.system;

    const handleCtaClick = () => {
        if (toast.ctaHref) {
            onDismiss(toast.toastId);
            navigate(toast.ctaHref);
        }
    };

    return (
        <div
            className="relative w-[360px] rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden pointer-events-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                        <span className="text-[14px] leading-none">{config.icon}</span>
                        <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {toast.title}
                        </span>
                    </div>
                    <button
                        onClick={() => onDismiss(toast.toastId)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0 p-0.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        aria-label="Đóng thông báo"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed pl-[30px] pr-2">
                    {toast.body}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between pl-[30px]">
                    {toast.ctaLabel && toast.ctaHref ? (
                        <button
                            onClick={handleCtaClick}
                            className={`text-sm font-medium ${config.color} hover:underline focus:outline-none`}
                        >
                            {toast.ctaLabel}
                        </button>
                    ) : (
                        <div /> // placeholder for flex space-between
                    )}
                    <span className="text-[12px] text-zinc-400">{timeAgo}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <motion.div
                className={`h-0.5 ${config.dot.replace('bg-', 'bg-').replace('-400', '-500')} w-full origin-left`}
                initial={{ scaleX: 1 }}
                animate={controls}
                onAnimationComplete={() => onDismiss(toast.toastId)}
            />
        </div>
    );
}
