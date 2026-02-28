import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const pathLabelsMap: Record<string, { vi: string; en: string }> = {
  '/': { vi: 'Tổng quan', en: 'Dashboard' },
  '/de-tai': { vi: 'Đề tài', en: 'Topics' },
  '/luan-van': { vi: 'Luận văn', en: 'Theses' },
  '/sinh-vien': { vi: 'Sinh viên', en: 'Students' },
  '/giang-vien': { vi: 'Giảng viên', en: 'Lecturers' },
  '/hoi-dong': { vi: 'Hội đồng', en: 'Council' },
  '/lich-bao-ve': { vi: 'Lịch bảo vệ', en: 'Schedule' },
  '/tien-do': { vi: 'Tiến độ', en: 'Progress' },
  '/bao-cao': { vi: 'Báo cáo', en: 'Reports' },
};

export default function TopBar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useTranslation();
  const pathLabel = pathLabelsMap[location.pathname];
  const currentLabel = pathLabel ? pathLabel[lang] : 'Page';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="hidden text-muted-foreground sm:inline">{t.topbar.breadcrumb_home}</span>
        <span className="hidden text-muted-foreground sm:inline">/</span>
        <span className="font-medium text-foreground truncate">{currentLabel}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hidden sm:flex">
          <Search className="h-4 w-4" />
          <span>{t.topbar.search}</span>
          <kbd className="ml-2 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:hidden text-muted-foreground hover:bg-secondary rounded-lg">
          <Search className="h-4 w-4" />
        </Button>

        {/* Language Toggle */}
        <div className="relative flex h-8 w-[68px] items-center rounded-full bg-secondary p-0.5">
          <motion.div
            className="absolute h-7 w-[30px] rounded-full bg-card shadow-sm"
            animate={{ x: lang === 'vi' ? 1 : 33 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          />
          <button
            onClick={() => setLang('vi')}
            className={`relative z-10 flex h-7 w-[30px] items-center justify-center rounded-full text-xs font-semibold tracking-wide transition-colors ${
              lang === 'vi' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => setLang('en')}
            className={`relative z-10 flex h-7 w-[30px] items-center justify-center rounded-full text-xs font-semibold tracking-wide transition-colors ${
              lang === 'en' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary">
          <Bell className="h-4 w-4" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, damping: 15, stiffness: 300 }}
            className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
          >
            3
          </motion.span>
        </Button>

        {/* Avatar */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          NA
        </div>
      </div>
    </header>
  );
}
