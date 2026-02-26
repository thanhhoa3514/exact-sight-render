import { useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pathLabels: Record<string, string> = {
  '/': 'Tổng quan',
  '/de-tai': 'Đề tài',
  '/luan-van': 'Luận văn',
  '/sinh-vien': 'Sinh viên',
  '/giang-vien': 'Giảng viên',
  '/hoi-dong': 'Hội đồng',
  '/lich-bao-ve': 'Lịch bảo vệ',
  '/tien-do': 'Tiến độ',
  '/bao-cao': 'Báo cáo',
};

export default function TopBar() {
  const location = useLocation();
  const currentLabel = pathLabels[location.pathname] || 'Trang';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">LVTN</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{currentLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Tìm kiếm...</span>
          <kbd className="ml-2 hidden rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          NA
        </div>
      </div>
    </header>
  );
}
