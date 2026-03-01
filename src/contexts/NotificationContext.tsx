import React, { createContext, useContext, useState } from 'react';
import { MOCK_NOTIFICATIONS_FULL, type Notification, type NotificationPayload } from '@/data/notificationData';

export interface Toast extends Notification {
    toastId: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    toasts: Toast[];
    push: (payload: NotificationPayload) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    dismiss: (id: string) => void;
    dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS_FULL);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const push = (payload: NotificationPayload) => {
        const id = crypto.randomUUID();
        const newNotification: Notification = {
            id,
            ...payload,
            read: false,
            createdAt: new Date(),
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Create an in-app toast for the new notification (max 3)
        setToasts((prev) => {
            const newToast: Toast = { ...newNotification, toastId: crypto.randomUUID() };
            return [newToast, ...prev].slice(0, 3);
        });
    };

    const markRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const dismissToast = (toastId: string) => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                toasts,
                push,
                markRead,
                markAllRead,
                dismiss,
                dismissToast,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
