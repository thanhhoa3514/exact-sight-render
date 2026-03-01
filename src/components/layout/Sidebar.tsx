import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, BookOpen, Users, GraduationCap,
  Shield, Calendar, TrendingUp, BarChart3, Settings, Bell,
  ChevronLeft, ChevronRight, PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface SidebarProps {
  onRestartTour?: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export default function Sidebar({ onRestartTour, collapsed, onCollapsedChange }: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { label: t.nav.dashboard, icon: LayoutDashboard, path: '/admin', id: 'nav-dashboard' },
    { label: t.nav.topics, icon: FileText, path: '/admin/de-tai', id: 'nav-de-tai' },
    { label: t.nav.theses, icon: BookOpen, path: '/admin/luan-van', id: 'nav-luan-van' },
    { label: t.nav.students, icon: Users, path: '/admin/sinh-vien', id: 'nav-sinh-vien' },
    { label: t.nav.lecturers, icon: GraduationCap, path: '/admin/giang-vien' },
    { label: t.nav.council, icon: Shield, path: '/admin/hoi-dong' },
    { label: t.nav.schedule, icon: Calendar, path: '/admin/lich-bao-ve' },
    { label: t.nav.progress, icon: TrendingUp, path: '/admin/tien-do' },
    { label: t.nav.reports, icon: BarChart3, path: '/admin/bao-cao' },
  ];

  const bottomItems = [
    { label: t.nav.settings, icon: Settings, path: '/admin/cai-dat' },
    { label: t.nav.notifications, icon: Bell, path: '/admin/thong-bao', badge: 3 },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-card"
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap font-display text-sm font-bold text-foreground"
            >
              LVTN Manager
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              id={'id' in item ? item.id : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-100',
                isActive
                  ? 'bg-secondary font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              )}
            >
              {/* Active left accent bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-foreground"
                  transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
                />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-border px-2 py-3">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-100 hover:bg-secondary/60 hover:text-foreground"
          >
            <div className="relative shrink-0">
              <item.icon className="h-[18px] w-[18px]" />
              {'badge' in item && item.badge && !collapsed && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Restart Tour Button */}
        {onRestartTour && (
          <button
            onClick={onRestartTour}
            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-100 hover:bg-secondary/60 hover:text-foreground"
          >
            <div className="relative shrink-0">
              <PlayCircle className="h-[18px] w-[18px]" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Xem lại hướng dẫn
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* User */}
        <div className="mt-2 flex items-center gap-3 rounded-md border border-border px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            NA
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-medium text-foreground">Nguyễn Văn A</p>
                <p className="truncate text-xs text-muted-foreground">Admin Khoa CNTT</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => onCollapsedChange(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-7 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
}
