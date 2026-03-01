import { useNotifications } from '@/contexts/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastItem } from './ToastItem';

export function ToastStack() {
    const { toasts, dismissToast } = useNotifications();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast, index) => {
                    // Stacking calculations:
                    // index 0: top most recent toast. scale 1, opacity 1, translate Y 0
                    // index 1: second toast. scale 0.97, opacity 0.85, translate Y 6px up (negative, wait, we are fixed bottom, so items naturally stack up if flex-col reverse, or we use absolute positioning)
                    return (
                        <motion.div
                            layout
                            key={toast.toastId}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{
                                opacity: index === 0 ? 1 : index === 1 ? 0.85 : 0.6,
                                x: 0,
                                scale: 1 - index * 0.03,
                                y: index * -8, // slight vertical offset depending on direction
                                zIndex: 3 - index,
                            }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={index > 0 ? 'absolute bottom-0' : 'relative'}
                            style={{
                                top: index > 0 ? 0 : 'auto', // Keep stacked items pinned to the bottom element
                                marginBottom: index === 0 && toasts.length > 1 ? `${toasts.length * 8}px` : '0px', // Add some space so we see the bottom cards
                            }}
                        >
                            <ToastItem toast={toast} onDismiss={dismissToast} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
