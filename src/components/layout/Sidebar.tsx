import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  Shield,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Tổng quan', icon: LayoutDashboard, path: '/' },
  { label: 'Đề tài', icon: FileText, path: '/de-tai' },
  { label: 'Luận văn', icon: BookOpen, path: '/luan-van' },
  { label: 'Sinh viên', icon: Users, path: '/sinh-vien' },
  { label: 'Giảng viên', icon: GraduationCap, path: '/giang-vien' },
  { label: 'Hội đồng', icon: Shield, path: '/hoi-dong' },
  { label: 'Lịch bảo vệ', icon: Calendar, path: '/lich-bao-ve' },
  { label: 'Tiến độ', icon: TrendingUp, path: '/tien-do' },
  { label: 'Báo cáo', icon: BarChart3, path: '/bao-cao' },
];

const bottomItems = [
  { label: 'Cài đặt', icon: Settings, path: '/cai-dat' },
  { label: 'Thông báo', icon: Bell, path: '/thong-bao', badge: 3 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150',
                isActive
                  ? 'bg-secondary font-medium text-foreground border-l-2 border-primary'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              )}
            >
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
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-150 hover:bg-secondary/60 hover:text-foreground"
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
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
}
