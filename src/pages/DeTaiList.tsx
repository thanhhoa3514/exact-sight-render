import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, ChevronRight, ChevronLeft, LayoutGrid, List,
  SlidersHorizontal, X, User, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from '@/components/shared/StatusBadge';
import DeTaiDetailPanel from '@/components/detail/DeTaiDetailPanel';
import { useDetailPanel } from '@/hooks/useDetailPanel';
import { useTranslation } from '@/contexts/LanguageContext';
import { mockDeTai, type ThesisStatus } from '@/data/mock';

// ── Helpers ──────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

const STATUS_TABS: (ThesisStatus | 'all')[] = [
  'all', 'dang_thuc_hien', 'cho_duyet', 'da_duyet', 'hoan_thanh', 'bi_tu_choi',
];

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

// ── Sub-components ───────────────────────────────────────

function StudentSlots({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex items-center gap-1" title={`${current}/${max}`}>
      {Array.from({ length: Math.min(max, 3) }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i < current ? 'bg-foreground' : 'bg-muted-foreground/20'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{current}/{max}</span>
    </div>
  );
}

// ── Card Variants ────────────────────────────────────────

const containerVariants = { animate: { transition: { staggerChildren: 0.05 } } };
const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const listItemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
};

// ── Unique values for filters ────────────────────────────

const allFields = [...new Set(mockDeTai.map((d) => d.linhVuc))];
const allSupervisors = [...new Set(mockDeTai.map((d) => d.giangVien))];

// ── Main Component ───────────────────────────────────────

export default function DeTaiList() {
  const { t } = useTranslation();

  // State
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<ThesisStatus | 'all'>('all');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('lvtn_topics_view') as ViewMode) || 'grid';
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('lvtn_topics_view', viewMode);
  }, [viewMode]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, statusTab, selectedFields, selectedSupervisors]);

  // Filtering
  const filtered = useMemo(() => {
    return mockDeTai.filter((dt) => {
      const matchSearch = dt.ten.toLowerCase().includes(search.toLowerCase()) || dt.ma.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusTab === 'all' || dt.trangThai === statusTab;
      const matchField = selectedFields.length === 0 || selectedFields.includes(dt.linhVuc);
      const matchSupervisor = selectedSupervisors.length === 0 || selectedSupervisors.includes(dt.giangVien);
      return matchSearch && matchStatus && matchField && matchSupervisor;
    });
  }, [search, statusTab, selectedFields, selectedSupervisors]);

  // Status counts
  const statusCounts = useMemo(() => {
    const base = mockDeTai.filter((dt) => {
      const matchSearch = dt.ten.toLowerCase().includes(search.toLowerCase()) || dt.ma.toLowerCase().includes(search.toLowerCase());
      const matchField = selectedFields.length === 0 || selectedFields.includes(dt.linhVuc);
      const matchSupervisor = selectedSupervisors.length === 0 || selectedSupervisors.includes(dt.giangVien);
      return matchSearch && matchField && matchSupervisor;
    });
    const counts: Record<string, number> = { all: base.length };
    for (const dt of base) counts[dt.trangThai] = (counts[dt.trangThai] || 0) + 1;
    return counts;
  }, [search, selectedFields, selectedSupervisors]);

  const pendingCount = statusCounts['cho_duyet'] || 0;

  // Pagination
  const perPage = viewMode === 'grid' ? 12 : 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // Detail panel
  const { selectedItem, isOpen, openPanel, closePanel } = useDetailPanel(filtered);

  // Filter chips
  const hasActiveFilters = selectedFields.length > 0 || selectedSupervisors.length > 0;

  const clearFilters = () => {
    setSearch('');
    setStatusTab('all');
    setSelectedFields([]);
    setSelectedSupervisors([]);
  };

  const toggleField = (f: string) =>
    setSelectedFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  const toggleSupervisor = (s: string) =>
    setSelectedSupervisors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const getStatusLabel = (s: ThesisStatus | 'all') => {
    if (s === 'all') return t.topics.tab_all;
    const map: Record<ThesisStatus, string> = {
      dang_thuc_hien: t.status.in_progress,
      cho_duyet: t.status.pending,
      da_duyet: t.status.approved,
      hoan_thanh: t.status.completed,
      bi_tu_choi: t.status.rejected,
      da_huy: t.status.cancelled,
    };
    return map[s];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {t.topics.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{mockDeTai.length} {t.topics.subtitle_count}</span>
            {' · HK2 2024-2025 · '}
            <span className="font-medium text-warning">
              {t.topics.pending_count.replace('{count}', String(pendingCount))}
            </span>
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t.topics.add_button}
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.topics.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filters popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {t.topics.filters}
                {hasActiveFilters && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                    {selectedFields.length + selectedSupervisors.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-4" align="end">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.topics.columns.field}</p>
                <div className="space-y-1.5">
                  {allFields.map((f) => (
                    <label key={f} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-secondary/50">
                      <Checkbox checked={selectedFields.includes(f)} onCheckedChange={() => toggleField(f)} />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.topics.columns.supervisor}</p>
                <div className="space-y-1.5">
                  {allSupervisors.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-secondary/50">
                      <Checkbox checked={selectedSupervisors.includes(s)} onCheckedChange={() => toggleSupervisor(s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter chips ── */}
      {hasActiveFilters && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {selectedFields.map((f) => (
            <button
              key={f}
              onClick={() => toggleField(f)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {f} <X className="h-3 w-3" />
            </button>
          ))}
          {selectedSupervisors.map((s) => (
            <button
              key={s}
              onClick={() => toggleSupervisor(s)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {s} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* ── Status tabs ── */}
      <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm transition-colors ${
              statusTab === tab
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {getStatusLabel(tab)}
            {(statusCounts[tab] ?? 0) > 0 && (
              <span className="rounded-full bg-secondary px-1.5 text-[11px] font-medium text-muted-foreground">
                {statusCounts[tab]}
              </span>
            )}
            {statusTab === tab && (
              <motion.span
                layoutId="detai-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">{t.topics.no_results_title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.topics.no_results_desc}</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t.topics.clear_filters}
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${safePage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {viewMode === 'grid' ? (
              /* ── Grid View ── */
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paged.map((dt, idx) => (
                  <motion.div
                    key={dt.id}
                    variants={cardVariants}
                    onClick={() => openPanel(dt, (safePage - 1) * perPage + idx)}
                    title={t.topics.click_hint}
                    className="group relative cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-150 ease-out hover:-translate-y-[2px] hover:border-muted-foreground/40 hover:shadow-md active:scale-[0.99]"
                  >
                    {/* Top: field + student slots */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {dt.linhVuc}
                      </span>
                      <StudentSlots current={dt.soLuongSV} max={dt.soLuongSVMax} />
                    </div>

                    {/* Code */}
                    <p className="mb-1 font-mono text-xs text-muted-foreground">{dt.ma}</p>

                    {/* Title */}
                    <h3 className="mb-4 line-clamp-3 text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-foreground">
                      {dt.ten}
                    </h3>

                    {/* Divider */}
                    <div className="my-3 border-t border-border" />

                    {/* Footer */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3 w-3" /> {dt.giangVien}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                          <Calendar className="h-3 w-3" /> {dt.ngayTao}
                        </p>
                      </div>
                      <StatusBadge status={dt.trangThai} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* ── List View ── */
              <div className="rounded-xl border border-border bg-card shadow-card">
                <motion.div variants={containerVariants} initial="initial" animate="animate">
                  {paged.map((dt, idx) => (
                    <motion.div
                      key={dt.id}
                      variants={listItemVariants}
                      onClick={() => openPanel(dt, (safePage - 1) * perPage + idx)}
                      title={t.topics.click_hint}
                      className="group relative flex cursor-pointer items-center gap-4 border-b border-border/50 px-4 py-3.5 transition-colors duration-100 hover:bg-secondary/30"
                    >
                      {/* Left accent bar */}
                      <span className="absolute bottom-2 left-0 top-2 w-0.5 origin-center scale-y-0 rounded-full bg-foreground transition-transform duration-150 group-hover:scale-y-100" />

                      <StudentSlots current={dt.soLuongSV} max={dt.soLuongSVMax} />

                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{dt.ma}</span>
                          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                            {dt.linhVuc}
                          </span>
                        </div>
                        <p className="truncate text-sm font-medium text-foreground">{dt.ten}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {dt.giangVien} · {dt.ngayTao}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge status={dt.trangThai} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {t.topics.showing_range
              .replace('{from}', String((safePage - 1) * perPage + 1))
              .replace('{to}', String(Math.min(safePage * perPage, filtered.length)))
              .replace('{total}', String(filtered.length))}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(safePage - 1)}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers(safePage, totalPages).map((page, i) =>
              page === '...' ? (
                <span key={`e${i}`} className="w-8 text-center text-sm text-muted-foreground">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors duration-100 ${
                    page === safePage
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Panel (untouched) ── */}
      <DeTaiDetailPanel item={selectedItem} isOpen={isOpen} onClose={closePanel} />
    </motion.div>
  );
}
