import { useState } from 'react';
import { Bell, FileText, CheckCircle2, XCircle, Calendar, Clock, MessageSquare, Settings, Check, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications, type Notification, type NotificationType } from '@/data/notificationData';
import { useTranslation } from '@/contexts/LanguageContext';

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  submission: { icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  approval: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  rejection: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
  defense: { icon: Calendar, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/40' },
  deadline: { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  comment: { icon: MessageSquare, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/40' },
  system: { icon: Settings, color: 'text-muted-foreground', bg: 'bg-secondary' },
};

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => onRead(notification.id)}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60
        ${!notification.read ? 'bg-primary/[0.03] dark:bg-primary/[0.06]' : ''}`}
    >
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{notification.title}</span>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-info" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{notification.message}</p>
        <span className="mt-1 block text-[11px] text-muted-foreground/70">{notification.time}</span>
      </div>
      <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
    </button>
  );
}

export default function NotificationPanel() {
  const { lang } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifications = notifications.filter(n => !n.read);

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
                exit={{ scale: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
              >
                {unreadCount}
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
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs font-medium text-info hover:text-info/80 transition-colors"
            >
              <Check className="h-3 w-3" />
              {lang === 'vi' ? 'Đọc tất cả' : 'Mark all read'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 h-10">
            <TabsTrigger value="all" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              {lang === 'vi' ? 'Chưa đọc' : 'Unread'}
              {unreadCount > 0 && (
                <span className="ml-1.5 text-[10px] text-muted-foreground">({unreadCount})</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-border">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <NotificationItem notification={n} onRead={handleRead} />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[400px]">
              {unreadNotifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {unreadNotifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <NotificationItem notification={n} onRead={handleRead} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-3">
                    <Check className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {lang === 'vi' ? 'Đã đọc hết!' : 'All caught up!'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lang === 'vi' ? 'Không có thông báo chưa đọc' : 'No unread notifications'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
