import { useState } from 'react';
import { Bell, FileText, CheckCircle2, XCircle, Calendar, Clock, MessageSquare, Settings, Check, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { NOTIFICATION_TYPES_CONFIG } from '@/data/notificationData';
import type { Notification } from '@/data/notificationData';
import { useNotifications } from '@/contexts/NotificationContext';
import { isToday, isYesterday, isThisWeek, formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '@/contexts/LanguageContext';

function NotificationItem({ notification, onRead, closePanel }: { notification: Notification; onRead: (id: string) => void; closePanel: () => void }) {
  const config = NOTIFICATION_TYPES_CONFIG[notification.type] || NOTIFICATION_TYPES_CONFIG.system;
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.read) onRead(notification.id);
    if (notification.ctaHref) {
      navigate(notification.ctaHref);
    }
    closePanel();
  };

  const timeAgo = formatDistanceToNowStrict(notification.createdAt, { addSuffix: true, locale: vi });

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50
        ${!notification.read ? config.bgAccent : 'bg-transparent'}`}
    >
      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!notification.read ? config.dot : 'bg-zinc-300 dark:bg-zinc-600'}`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-[14px] truncate ${!notification.read ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'font-medium text-zinc-700 dark:text-zinc-300 opacity-80'}`}>
            {notification.title}
          </span>
          <span className="shrink-0 text-[12px] text-zinc-400 font-normal">{timeAgo}</span>
        </div>
        <p className={`mt-0.5 text-[13px] line-clamp-1 leading-relaxed ${!notification.read ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
          {notification.body}
        </p>
      </div>
    </button>
  );
}

export default function NotificationPanel() {
  const { lang } = useTranslation();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  // Grouping function
  const groupNotifications = (list: Notification[]) => {
    const groups: { label: string; items: Notification[] }[] = [
      { label: lang === 'vi' ? 'Hôm nay' : 'Today', items: list.filter(n => isToday(n.createdAt)) },
      { label: lang === 'vi' ? 'Hôm qua' : 'Yesterday', items: list.filter(n => isYesterday(n.createdAt)) },
      { label: lang === 'vi' ? 'Tuần này' : 'This week', items: list.filter(n => isThisWeek(n.createdAt) && !isToday(n.createdAt) && !isYesterday(n.createdAt)) },
      { label: lang === 'vi' ? 'Cũ hơn' : 'Older', items: list.filter(n => !isThisWeek(n.createdAt)) },
    ];
    return groups.filter(g => g.items.length > 0);
  };

  const allGroups = groupNotifications(notifications);
  const unreadGroups = groupNotifications(notifications.filter(n => !n.read));
  // Stub for 'Mine': filtering by some condition (for now just returning all)
  const mineGroups = groupNotifications(notifications);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                // simple pulse on unread count change can be added
                exit={{ scale: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white px-1"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[380px] p-0 rounded-xl shadow-elevated border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {lang === 'vi' ? 'Thông báo' : 'Notifications'}
            </h3>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Check className="h-3 w-3" />
              {lang === 'vi' ? 'Đánh dấu tất cả đã đọc' : 'Mark all read'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 h-10">
            <TabsTrigger value="all" className="text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 pt-2">
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 pt-2">
              {lang === 'vi' ? 'Chưa đọc' : 'Unread'}
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-medium">{unreadCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="mine" className="text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 pt-2">
              {lang === 'vi' ? 'Của tôi' : 'Mine'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[432px]">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 pb-12">
                {allGroups.map((group) => (
                  <div key={group.label}>
                    <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 py-2 text-[12px] font-medium text-zinc-500">
                      {group.label}
                    </div>
                    {group.items.map((n, i) => (
                      <NotificationItem key={n.id} notification={n} onRead={markRead} closePanel={() => setOpen(false)} />
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[432px]">
              {unreadGroups.length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 pb-12">
                  {unreadGroups.map((group) => (
                    <div key={group.label}>
                      <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 py-2 text-[12px] font-medium text-zinc-500">
                        {group.label}
                      </div>
                      {group.items.map((n, i) => (
                        <NotificationItem key={n.id} notification={n} onRead={markRead} closePanel={() => setOpen(false)} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-3">
                    <Bell className="h-5 w-5 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {lang === 'vi' ? 'Không có thông báo mới' : 'No new notifications'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mine" className="mt-0">
            <ScrollArea className="h-[432px]">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 pb-12">
                {mineGroups.map((group) => (
                  <div key={group.label}>
                    <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 py-2 text-[12px] font-medium text-zinc-500">
                      {group.label}
                    </div>
                    {group.items.map((n, i) => (
                      <NotificationItem key={n.id} notification={n} onRead={markRead} closePanel={() => setOpen(false)} />
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer Link */}
        <div className="absolute bottom-0 w-full left-0 border-t border-border bg-white dark:bg-zinc-900 p-2 z-20">
          <button
            onClick={() => { setOpen(false); /* navigate('/notifications') */ }}
            className="w-full py-1.5 text-[13px] font-medium text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === 'vi' ? 'Xem tất cả thông báo →' : 'View all notifications →'}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
