import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DeTaiDetailPanel from '@/components/detail/DeTaiDetailPanel';
import { useDetailPanel } from '@/hooks/useDetailPanel';
import { useTranslation } from '@/contexts/LanguageContext';
import { mockDeTai } from '@/data/mock';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};
const listVariants = { animate: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

export default function DeTaiList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { t } = useTranslation();

  const filtered = mockDeTai.filter((dt) => {
    const matchSearch = dt.ten.toLowerCase().includes(search.toLowerCase()) || dt.ma.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || dt.trangThai === statusFilter;
    return matchSearch && matchStatus;
  });

  const { selectedItem, isOpen, openPanel, closePanel } = useDetailPanel(filtered);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <PageHeader
        title={t.topics.title}
        description={`${mockDeTai.length} ${t.topics.subtitle_count} · HK2 2024-2025`}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t.topics.add_button}
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.topics.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.topics.all_statuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.topics.all_statuses}</SelectItem>
            <SelectItem value="cho_duyet">{t.status.pending}</SelectItem>
            <SelectItem value="da_duyet">{t.status.approved}</SelectItem>
            <SelectItem value="dang_thuc_hien">{t.status.in_progress}</SelectItem>
            <SelectItem value="hoan_thanh">{t.status.completed}</SelectItem>
            <SelectItem value="bi_tu_choi">{t.status.rejected}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.code}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.name}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.supervisor}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.field}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.students}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.status}</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.topics.columns.created}</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <motion.tbody variants={listVariants} initial="initial" animate="animate">
              {filtered.map((dt, index) => (
                <motion.tr
                  key={dt.id}
                  variants={itemVariants}
                  onClick={() => openPanel(dt, index)}
                  title={t.topics.click_hint}
                  className="group cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{dt.ma}</td>
                  <td className="max-w-[300px] truncate px-4 py-3 font-medium text-foreground">{dt.ten}</td>
                  <td className="px-4 py-3 text-muted-foreground">{dt.giangVien}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{dt.linhVuc}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{dt.soLuongSV}/{dt.soLuongSVMax}</td>
                  <td className="px-4 py-3"><StatusBadge status={dt.trangThai} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{dt.ngayTao}</td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {t.topics.showing.replace('{count}', String(filtered.length)).replace('{total}', String(mockDeTai.length))}
        </div>
      </div>

      <DeTaiDetailPanel item={selectedItem} isOpen={isOpen} onClose={closePanel} />
    </motion.div>
  );
}
