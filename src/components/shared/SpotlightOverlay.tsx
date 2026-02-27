import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export interface SpotlightOverlayProps {
    targetSelector: string
}

export function SpotlightOverlay({ targetSelector }: SpotlightOverlayProps) {
    const [rect, setRect] = useState<DOMRect | null>(null)
    const PADDING = 8

    useEffect(() => {
        // A bit of delay to let the DOM layout calculate properly
        const timer = setTimeout(() => {
            const el = document.querySelector(targetSelector)
            if (el) {
                const r = el.getBoundingClientRect()
                setRect(r)

                // Smooth scroll element vào view
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })

                // Hover effect on the target element
                el.classList.add('bg-secondary/60', 'text-foreground')

                // Pulse animation trên target element
                el.classList.add('onboarding-pulse')
            }
        }, 100)

        return () => {
            clearTimeout(timer)
            const el = document.querySelector(targetSelector)
            if (el) {
                el.classList.remove('onboarding-pulse')
                el.classList.remove('bg-secondary/60', 'text-foreground')
            }
        }
    }, [targetSelector])

    if (!rect) return null

    return (
        <motion.div
            className="fixed inset-0 z-[101] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="spotlight-mask">
                        {/* Toàn bộ màn hình trắng (hidden) */}
                        <rect width="100%" height="100%" fill="white" />
                        {/* Vùng spotlight đen (visible = không bị mask) */}
                        <motion.rect
                            initial={{
                                x: rect.x - PADDING - 20,
                                y: rect.y - PADDING - 20,
                                width: rect.width + PADDING * 2 + 40,
                                height: rect.height + PADDING * 2 + 40,
                                rx: 12,
                            }}
                            animate={{
                                x: rect.x - PADDING,
                                y: rect.y - PADDING,
                                width: rect.width + PADDING * 2,
                                height: rect.height + PADDING * 2,
                                rx: 12,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            fill="black"
                        />
                    </mask>
                </defs>
                {/* Overlay với lỗ đục */}
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.55)"
                    mask="url(#spotlight-mask)"
                />
                {/* Border glow xung quanh spotlight */}
                <motion.rect
                    initial={{
                        x: rect.x - PADDING - 20,
                        y: rect.y - PADDING - 20,
                        width: rect.width + PADDING * 2 + 40,
                        height: rect.height + PADDING * 2 + 40,
                    }}
                    animate={{
                        x: rect.x - PADDING,
                        y: rect.y - PADDING,
                        width: rect.width + PADDING * 2,
                        height: rect.height + PADDING * 2,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    rx={12}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.4"
                />
            </svg>
        </motion.div>
    )
}
