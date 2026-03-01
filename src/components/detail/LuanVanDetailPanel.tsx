import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, MoreHorizontal, FileText, Star, Save, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { LuanVan } from '@/data/mock';

interface LuanVanDetailPanelProps {
  item: LuanVan | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignCouncil?: (item: LuanVan) => Promise<void> | void;
  onSave?: (item: LuanVan) => Promise<void> | void;
}

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.2 } },
};
const tabContentVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};
const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };
const staggerItem = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const mockTimeline = [
  { label: 'Nộp đề cương', date: '15/01', done: true },
  { label: 'Báo cáo tuần 4', date: '01/02', done: true },
  { label: 'Nộp bản nháp hoàn chỉnh', date: '28/02', done: false, current: true },
  { label: 'Nộp bản chính thức', date: '10/03', done: false },
  { label: 'Bảo vệ', date: '15/03', done: false },
];

function ScoreBar({ label, score }: { label: string; score: number | undefined }) {
  if (score === undefined) return null;
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-muted-foreground">{label}</span>
      <span className="w-10 text-center font-mono text-sm font-semibold text-foreground">{score}</span>
      <div className="h-1.5 flex-1 rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function getGrade(avg: number) {
  if (avg >= 9) return 'grade_excellent';
  if (avg >= 8) return 'grade_good';
  if (avg >= 7) return 'grade_fair';
  return 'grade_average';
}

export default function LuanVanDetailPanel({ item, isOpen, onClose, onAssignCouncil, onSave }: LuanVanDetailPanelProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<LuanVan | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      return;
    }
    if (item) {
      setEditedItem({ ...item });
      setIsEditing(false);
    } else {
      setEditedItem(null);
    }
  }, [item, isOpen]);

  if (!item || !editedItem) return null;

  const hasScores = editedItem.diemGVHD !== undefined && editedItem.diemPhanBien !== undefined && editedItem.diemHoiDong !== undefined;
  const avg = hasScores ? ((editedItem.diemGVHD! + editedItem.diemPhanBien! + editedItem.diemHoiDong!) / 3) : 0;
  const stars = Math.round(avg / 2);

  const handleSave = async () => {
    if (!editedItem) return;
    try {
      if (onSave) {
        await onSave(editedItem);
      }
      setIsEditing(false);
      toast.success('Đã lưu thay đổi luận văn thành công');
    } catch (error) {
      console.error('Failed to save LuanVan:', error);
      toast.error('Lỗi khi lưu thay đổi luận văn');
    }
  };

  const handleAssignCouncil = async () => {
    if (!editedItem) return;
    const updated = { ...editedItem, trangThai: 'dang_thuc_hien' as const };
    try {
      if (onAssignCouncil) {
        await onAssignCouncil(updated);
      }
      setEditedItem(updated);
      toast.success('Đã phân công hội đồng đánh giá');
    } catch (error) {
      console.error('Failed to assign council:', error);
      toast.error('Lỗi khi phân công hội đồng');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col border-l border-border bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-muted-foreground">
                <X className="h-4 w-4" />
                {t.detail.close}
              </Button>
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditedItem({ ...item }); }} className="gap-1.5 text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      {t.detail.cancel}
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave} className="gap-1.5">
                      <Save className="h-4 w-4" />
                      {t.detail.save}
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 text-muted-foreground">
                    <Edit className="h-4 w-4" />
                    {t.detail.edit}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="border-b border-border px-5 py-4">
              <p className="font-mono text-xs text-muted-foreground">{editedItem.ma}</p>
              {isEditing ? (
                <Input
                  value={editedItem.ten}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, ten: e.target.value } : prev)}
                  className="mt-1 font-display text-lg font-semibold h-10"
                />
              ) : (
                <h2 className="mt-1 font-display text-lg font-semibold leading-tight text-foreground">{editedItem.ten}</h2>
              )}
              <div className="mt-2">
                <StatusBadge status={editedItem.trangThai} />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="info" className="flex flex-1 flex-col overflow-hidden">
              <TabsList className="mx-5 mt-3 w-auto justify-start bg-transparent p-0 border-b border-border rounded-none">
                <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.info}
                </TabsTrigger>
                <TabsTrigger value="progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.progress}
                </TabsTrigger>
                <TabsTrigger value="scores" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.scores}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="info" className="m-0 px-5 py-4">
                  <motion.div variants={tabContentVariants} initial="initial" animate="animate" className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.student_name}</p>
                          <Input value={editedItem.sinhVien} onChange={(e) => setEditedItem(prev => prev ? { ...prev, sinhVien: e.target.value } : prev)} className="mt-1 h-8" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.student_id}</p>
                          <Input value={editedItem.mssv} onChange={(e) => setEditedItem(prev => prev ? { ...prev, mssv: e.target.value } : prev)} className="mt-1 h-8 font-mono" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.supervisor}</p>
                          <Input value={editedItem.giangVienHD} onChange={(e) => setEditedItem(prev => prev ? { ...prev, giangVienHD: e.target.value } : prev)} className="mt-1 h-8" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <InfoRow label={t.detail.student_name} value={editedItem.sinhVien} />
                        <InfoRow label={t.detail.student_id} value={editedItem.mssv} mono />
                        <InfoRow label={t.detail.supervisor} value={editedItem.giangVienHD} />
                      </>
                    )}
                    <InfoRow label={t.detail.defense_batch} value={`Đợt 1 - ${editedItem.hocKy}`} />
                    {editedItem.ngayNop && <InfoRow label={t.detail.submitted_at} value={editedItem.ngayNop} />}
                    <InfoRow label={t.detail.plagiarism} value="8%" extra={`(✓ ${t.detail.valid})`} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="progress" className="m-0 px-5 py-4">
                  <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative pl-6">
                    <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                    {mockTimeline.map((step, i) => (
                      <motion.div key={i} variants={staggerItem} className="relative pb-6 last:pb-0">
                        <div className={`absolute -left-6 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${step.done
                          ? 'border-success bg-success text-success-foreground'
                          : step.current
                            ? 'border-warning bg-warning text-warning-foreground animate-pulse'
                            : 'border-border bg-card'
                          }`}>
                          {step.done && <span className="text-[10px]">✓</span>}
                          {step.current && <span className="text-[10px]">⏳</span>}
                        </div>
                        <div>
                          <p className={`text-sm ${step.current ? 'font-semibold text-foreground' : step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.date}</p>
                          {step.current && (
                            <p className="mt-0.5 text-xs text-warning">[{t.detail.not_submitted}] — {t.detail.days_left.replace('{n}', '2')}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="scores" className="m-0 px-5 py-4">
                  <motion.div variants={tabContentVariants} initial="initial" animate="animate" className="space-y-4">
                    {hasScores ? (
                      <>
                        <ScoreBar label={t.detail.score_supervisor} score={editedItem.diemGVHD} />
                        <ScoreBar label={t.detail.score_reviewer} score={editedItem.diemPhanBien} />
                        <ScoreBar label={t.detail.score_council} score={editedItem.diemHoiDong} />
                        <div className="border-t border-border pt-4">
                          <div className="flex items-center gap-3">
                            <span className="w-20 text-sm font-semibold text-foreground">{t.detail.score_total}</span>
                            <span className="w-10 text-center font-mono text-lg font-bold text-foreground">{avg.toFixed(1)}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < stars ? 'fill-warning text-warning' : 'text-border'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            ({t.detail.grade}: {t.detail[getGrade(avg) as keyof typeof t.detail]})
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa có điểm</p>
                    )}
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{t.detail.keyboard_hint}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <FileText className="h-3 w-3" />
                    {t.detail.view_thesis}
                  </Button>
                  {(editedItem.trangThai === 'da_duyet' || editedItem.trangThai === 'dang_thuc_hien') && (
                    <Button size="sm" onClick={handleAssignCouncil} className="gap-1.5">
                      <Users className="h-3 w-3" />
                      {t.detail.assign_council}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, value, mono, extra }: { label: string; value: string; mono?: boolean; extra?: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm text-foreground ${mono ? 'font-mono' : ''}`}>
        {value} {extra && <span className="text-success">{extra}</span>}
      </p>
    </div>
  );
}
