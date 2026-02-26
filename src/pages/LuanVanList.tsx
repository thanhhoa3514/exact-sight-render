import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import LuanVanDetailPanel from '@/components/detail/LuanVanDetailPanel';
import { useDetailPanel } from '@/hooks/useDetailPanel';
import { useTranslation } from '@/contexts/LanguageContext';
import { mockLuanVan } from '@/data/mock';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};
const listVariants = { animate: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

export default function LuanVanList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useTranslation();

  const filtered = mockLuanVan.filter((lv) => {
    const matchSearch = lv.ten.toLowerCase().includes(search.toLowerCase()) || lv.mssv.includes(search);
    const matchStatus = statusFilter === 'all' || lv.trangThai === statusFilter;
    return matchSearch && matchStatus;
  });

  const { selectedItem, isOpen, openPanel, closePanel } = useDetailPanel(filtered);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <PageHeader title={t.theses.title} description={`${mockLuanVan.length} ${t.theses.subtitle_count} · HK2 2024-2025`} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t.theses.search_placeholder} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.topics.all_statuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="cho_duyet">{t.status.pending}</SelectItem>
            <SelectItem value="dang_thuc_hien">{t.status.in_progress}</SelectItem>
            <SelectItem value="hoan_thanh">{t.status.completed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.code}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.name}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.student}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.student_id}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.supervisor}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.status}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.theses.columns.avg_score}</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <motion.tbody variants={listVariants} initial="initial" animate="animate">
              {filtered.map((lv, index) => {
                const avg = lv.diemGVHD && lv.diemPhanBien && lv.diemHoiDong
                  ? ((lv.diemGVHD + lv.diemPhanBien + lv.diemHoiDong) / 3).toFixed(1)
                  : '—';
                return (
                  <motion.tr
                    key={lv.id}
                    variants={itemVariants}
                    onClick={() => openPanel(lv, index)}
                    className="group cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{lv.ma}</td>
                    <td className="max-w-[280px] truncate px-4 py-3 font-medium text-foreground">{lv.ten}</td>
                    <td className="px-4 py-3 text-foreground">{lv.sinhVien}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{lv.mssv}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lv.giangVienHD}</td>
                    <td className="px-4 py-3"><StatusBadge status={lv.trangThai} /></td>
                    <td className="px-4 py-3 font-semibold text-foreground">{avg}</td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {t.theses.showing.replace('{count}', String(filtered.length)).replace('{total}', String(mockLuanVan.length))}
        </div>
      </div>

      <LuanVanDetailPanel item={selectedItem} isOpen={isOpen} onClose={closePanel} />
    </motion.div>
  );
}
