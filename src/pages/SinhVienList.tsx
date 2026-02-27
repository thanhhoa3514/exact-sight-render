import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, ChevronRight, ChevronLeft, LayoutGrid, List,
  X, GraduationCap, FileText, AlertTriangle, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import StatusBadgeStudent from '@/components/shared/StatusBadgeStudent';
import StudentDetailPanel from '@/components/detail/StudentDetailPanel';
import { useDetailPanel } from '@/hooks/useDetailPanel';
import { mockSinhVien, type StudentStatus, type SinhVien } from '@/data/mock';

// ── Helpers ──────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

const STATUS_TABS: (StudentStatus | 'all')[] = [
  'all', 'chua_dang_ky', 'da_dang_ky', 'dang_thuc_hien', 'cho_bao_ve', 'hoan_thanh',
];

const STATUS_LABELS: Record<StudentStatus | 'all', string> = {
  all: 'Tất cả',
  chua_dang_ky: 'Chưa đăng ký',
  da_dang_ky: 'Đã đăng ký',
  dang_thuc_hien: 'Đang TH',
  cho_bao_ve: 'Chờ BV',
  hoan_thanh: 'Hoàn thành',
};

const PIPELINE_COLORS: Record<StudentStatus, string> = {
  chua_dang_ky: 'bg-muted-foreground/20 dark:bg-muted-foreground/30',
  da_dang_ky: 'bg-info/40 dark:bg-info/50',
  dang_thuc_hien: 'bg-violet dark:bg-violet',
  cho_bao_ve: 'bg-warning dark:bg-warning',
  hoan_thanh: 'bg-success dark:bg-success',
};

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function getInitials(name: string) {
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
}

function getAvatarColor(id: string) {
  const colors = [
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  ];
  return colors[id.charCodeAt(0) % colors.length];
}

// ── Variants ─────────────────────────────────────────────

const containerVariants = { animate: { transition: { staggerChildren: 0.05 } } };
const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const listItemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
};

// ── Unique filter values ─────────────────────────────────

const allChuyenNganh = [...new Set(mockSinhVien.map(s => s.chuyen_nganh))];
const allGVHD = [...new Set(mockSinhVien.filter(s => s.gvhd).map(s => s.gvhd!.name))];

function getGVHDCount(name: string) {
  return mockSinhVien.filter(s => s.gvhd?.name === name).length;
}

// ── Main Component ───────────────────────────────────────

export default function SinhVienList() {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<StudentStatus | 'all'>('all');
  const [selectedCN, setSelectedCN] = useState<string[]>([]);
  const [selectedGV, setSelectedGV] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    (localStorage.getItem('lvtn_students_view') as ViewMode) || 'grid'
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { localStorage.setItem('lvtn_students_view', viewMode); }, [viewMode]);
  useEffect(() => { setCurrentPage(1); }, [search, statusTab, selectedCN, selectedGV]);

  // Filtering
  const filtered = useMemo(() => {
    return mockSinhVien.filter(sv => {
      const q = search.toLowerCase();
      const matchSearch = sv.name.toLowerCase().includes(q) || sv.mssv.includes(search);
      const matchStatus = statusTab === 'all' || sv.status === statusTab;
      const matchCN = selectedCN.length === 0 || selectedCN.includes(sv.chuyen_nganh);
      const matchGV = selectedGV.length === 0 || (sv.gvhd && selectedGV.includes(sv.gvhd.name));
      return matchSearch && matchStatus && matchCN && matchGV;
    });
  }, [search, statusTab, selectedCN, selectedGV]);

  // Pipeline stats (independent of statusTab)
  const pipelineStats = useMemo(() => {
    const base = mockSinhVien.filter(sv => {
      const q = search.toLowerCase();
      const matchSearch = sv.name.toLowerCase().includes(q) || sv.mssv.includes(search);
      const matchCN = selectedCN.length === 0 || selectedCN.includes(sv.chuyen_nganh);
      const matchGV = selectedGV.length === 0 || (sv.gvhd && selectedGV.includes(sv.gvhd.name));
      return matchSearch && matchCN && matchGV;
    });
    const counts: Record<string, number> = { all: base.length };
    for (const sv of base) counts[sv.status] = (counts[sv.status] || 0) + 1;
    return counts;
  }, [search, selectedCN, selectedGV]);

  const total = pipelineStats['all'] || 0;

  // Pagination
  const perPage = viewMode === 'grid' ? 15 : 25;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const { selectedItem, isOpen, openPanel, closePanel } = useDetailPanel(filtered);

  const hasActiveFilters = selectedCN.length > 0 || selectedGV.length > 0;
  const clearFilters = () => { setSearch(''); setStatusTab('all'); setSelectedCN([]); setSelectedGV([]); };
  const toggleCN = (v: string) => setSelectedCN(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleGV = (v: string) => setSelectedGV(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const pipelineStages: { key: StudentStatus; label: string }[] = [
    { key: 'chua_dang_ky', label: 'Chưa đăng ký' },
    { key: 'da_dang_ky', label: 'Đã đăng ký' },
    { key: 'dang_thuc_hien', label: 'Đang thực hiện' },
    { key: 'cho_bao_ve', label: 'Chờ bảo vệ' },
    { key: 'hoan_thanh', label: 'Hoàn thành' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Sinh viên</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{mockSinhVien.length} sinh viên</span>
            {' · HK2 2024-2025'}
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Thêm sinh viên
        </Button>
      </div>

      {/* ── Pipeline Bar ── */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-card">
        {/* Segmented bar */}
        <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-secondary">
          {pipelineStages.map(stage => {
            const count = pipelineStats[stage.key] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return pct > 0 ? (
              <motion.div
                key={stage.key}
                className={`h-full ${PIPELINE_COLORS[stage.key]} cursor-pointer transition-opacity hover:opacity-80`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => setStatusTab(stage.key)}
                title={`${stage.label}: ${count}`}
              />
            ) : null;
          })}
        </div>

        {/* Stage labels */}
        <div className="flex items-start justify-between gap-2">
          {pipelineStages.map(stage => {
            const count = pipelineStats[stage.key] || 0;
            const isActive = statusTab === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setStatusTab(isActive ? 'all' : stage.key)}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <span className={`text-lg font-bold tabular-nums ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {count}
                </span>
                <span className={`text-[11px] text-center leading-tight ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
                <span className={`h-1 w-1 rounded-full transition-all ${isActive ? 'bg-foreground scale-100' : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-muted-foreground'}`} />
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {total} sinh viên · HK2 2024-2025
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, MSSV..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Chuyên ngành */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                Chuyên ngành
                {selectedCN.length > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">{selectedCN.length}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 space-y-1.5" align="end">
              {allChuyenNganh.map(cn => (
                <label key={cn} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-secondary/50">
                  <Checkbox checked={selectedCN.includes(cn)} onCheckedChange={() => toggleCN(cn)} />
                  {cn}
                </label>
              ))}
            </PopoverContent>
          </Popover>

          {/* GVHD */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                GVHD
                {selectedGV.length > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">{selectedGV.length}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-1.5" align="end">
              {allGVHD.map(gv => (
                <label key={gv} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-secondary/50">
                  <Checkbox checked={selectedGV.includes(gv)} onCheckedChange={() => toggleGV(gv)} />
                  {gv} <span className="ml-auto text-xs text-muted-foreground">({getGVHDCount(gv)})</span>
                </label>
              ))}
            </PopoverContent>
          </Popover>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button onClick={() => setViewMode('grid')} className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter chips ── */}
      {hasActiveFilters && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {selectedCN.map(v => (
            <button key={v} onClick={() => toggleCN(v)} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
              {v} <X className="h-3 w-3" />
            </button>
          ))}
          {selectedGV.map(v => (
            <button key={v} onClick={() => toggleGV(v)} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
              {v} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* ── Status tabs ── */}
      <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-border">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm transition-colors ${
              statusTab === tab ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {STATUS_LABELS[tab]}
            {(pipelineStats[tab] ?? 0) > 0 && (
              <span className={`rounded-full px-1.5 text-[11px] font-medium ${statusTab === tab ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'}`}>
                {pipelineStats[tab]}
              </span>
            )}
            {statusTab === tab && (
              <motion.span
                layoutId="sinhvien-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Không tìm thấy sinh viên</h3>
          <p className="mt-1 text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground">
            Xóa tất cả bộ lọc
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${safePage}-${statusTab}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {viewMode === 'grid' ? (
              /* ── Grid View ── */
              <motion.div
                variants={containerVariants} initial="initial" animate="animate"
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {paged.map((sv, idx) => {
                  const isAtRisk = sv.gpa < 2.5 || sv.thesis?.is_overdue;
                  return (
                    <motion.div
                      key={sv.id}
                      variants={cardVariants}
                      onClick={() => openPanel(sv, (safePage - 1) * perPage + idx)}
                      className="group relative cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-150 ease-out hover:-translate-y-[2px] hover:border-muted-foreground/40 hover:shadow-md active:scale-[0.99]"
                    >
                      {isAtRisk && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10">
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        </span>
                      )}

                      {/* Avatar + Name */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(sv.id)}`}>
                          {getInitials(sv.name)}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground leading-tight">{sv.name}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{sv.mssv} · {sv.khoa_hoc}</p>
                        <p className="text-[11px] text-muted-foreground">{sv.chuyen_nganh}</p>
                      </div>

                      <div className="my-3 border-t border-border" />

                      {/* GVHD */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <GraduationCap className="h-3 w-3 shrink-0" />
                        {sv.gvhd ? (
                          <span className="truncate">{sv.gvhd.hoc_vi} {sv.gvhd.name}</span>
                        ) : (
                          <span className="italic text-muted-foreground/50">Chưa có GVHD</span>
                        )}
                      </div>

                      {/* Thesis info */}
                      {sv.thesis ? (
                        <div className="mt-2">
                          <div className="flex items-start gap-1.5">
                            <FileText className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="line-clamp-2 text-xs text-foreground/80">{sv.thesis.title}</span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-violet transition-all"
                                style={{ width: `${sv.thesis.progress_pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">{sv.thesis.progress_pct}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 rounded-md bg-warning/5 px-2 py-1.5 text-center">
                          <span className="text-[11px] text-warning">⚠ Chưa đăng ký đề tài</span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-muted-foreground">GPA</span>
                          <span className={`text-xs font-bold ${sv.gpa >= 3.2 ? 'text-emerald-600' : sv.gpa >= 2.5 ? 'text-foreground' : 'text-destructive'}`}>
                            {sv.gpa.toFixed(2)}
                          </span>
                        </div>
                        {sv.thesis ? (
                          <StatusBadgeStudent status={sv.status} />
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            Chưa đăng ký
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* ── List View ── */
              <div className="rounded-xl border border-border bg-card shadow-card">
                <motion.div variants={containerVariants} initial="initial" animate="animate">
                  {paged.map((sv, idx) => {
                    const isAtRisk = sv.gpa < 2.5 || sv.thesis?.is_overdue;
                    return (
                      <motion.div
                        key={sv.id}
                        variants={listItemVariants}
                        onClick={() => openPanel(sv, (safePage - 1) * perPage + idx)}
                        className="group relative flex cursor-pointer items-center gap-4 border-b border-border/50 px-4 py-3.5 transition-colors duration-100 hover:bg-secondary/30"
                      >
                        {/* Left accent */}
                        <span className={`absolute bottom-3 left-0 top-3 w-0.5 origin-center scale-y-0 rounded-full transition-transform duration-150 group-hover:scale-y-100 ${isAtRisk ? 'bg-destructive' : 'bg-foreground'}`} />

                        {/* Avatar */}
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(sv.id)}`}>
                          {getInitials(sv.name)}
                        </div>

                        {/* Main info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{sv.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">{sv.mssv}</span>
                            <span className="hidden sm:inline rounded-md bg-secondary px-1.5 py-0.5 text-[11px] text-secondary-foreground">{sv.khoa_hoc}</span>
                            <span className="hidden md:inline text-xs text-muted-foreground">{sv.chuyen_nganh}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="truncate">{sv.gvhd?.name ?? <span className="italic text-muted-foreground/50">Chưa có GVHD</span>}</span>
                            {sv.thesis && (
                              <>
                                <span className="text-muted-foreground/30">·</span>
                                <span className="truncate text-foreground/70">{sv.thesis.title}</span>
                                <div className="hidden sm:flex h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                                  <div className="h-full rounded-full bg-violet" style={{ width: `${sv.thesis.progress_pct}%` }} />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex shrink-0 items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground">GPA</span>
                            <p className={`text-sm font-bold ${sv.gpa >= 3.2 ? 'text-emerald-600' : sv.gpa >= 2.5 ? 'text-foreground' : 'text-destructive'}`}>
                              {sv.gpa.toFixed(2)}
                            </p>
                          </div>
                          <StatusBadgeStudent status={sv.status} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                        </div>
                      </motion.div>
                    );
                  })}
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
            Hiển thị {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} trong {filtered.length} sinh viên
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(safePage - 1)} disabled={safePage === 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers(safePage, totalPages).map((page, i) =>
              page === '...' ? (
                <span key={`e${i}`} className="w-8 text-center text-sm text-muted-foreground">…</span>
              ) : (
                <button key={page} onClick={() => setCurrentPage(page as number)} className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors duration-100 ${page === safePage ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary'}`}>
                  {page}
                </button>
              )
            )}
            <button onClick={() => setCurrentPage(safePage + 1)} disabled={safePage === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Panel ── */}
      <StudentDetailPanel item={selectedItem} isOpen={isOpen} onClose={closePanel} />
    </motion.div>
  );
}
