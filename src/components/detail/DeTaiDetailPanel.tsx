import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, MoreHorizontal, FileText, ChevronRight, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { DeTai } from '@/data/mock';

interface DeTaiDetailPanelProps {
  item: DeTai | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedItem: DeTai) => Promise<void> | void;
  onApprove?: (updatedItem: DeTai) => Promise<void> | void;
  onReject?: (updatedItem: DeTai) => Promise<void> | void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.2 } },
};

const tabContentVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };
const staggerItem = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const mockDocuments = [
  { name: 'luan_van_v2.pdf', size: '2.3MB', date: '20/02' },
  { name: 'bao_cao_tien_do.docx', size: '1.1MB', date: '18/02' },
];

export default function DeTaiDetailPanel({ item, isOpen, onClose, onSave, onApprove, onReject }: DeTaiDetailPanelProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<DeTai | null>(null);

  // Sync state when item changes
  useEffect(() => {
    if (item) setEditedItem({ ...item });
  }, [item]);

  if (!item || !editedItem) return null;

  const handleSave = async () => {
    if (!editedItem) return;
    try {
      if (onSave) {
        await onSave(editedItem);
      }
      setIsEditing(false);
      toast.success('Đã lưu thay đổi đề tài thành công');
    } catch (error) {
      console.error('Failed to save DeTai:', error);
      toast.error('Lỗi khi lưu thay đổi đề tài');
    }
  };

  const handleApprove = async () => {
    if (!editedItem) return;
    const updated = { ...editedItem, trangThai: 'dang_thuc_hien' as const };
    try {
      if (onApprove) {
        await onApprove(updated);
      }
      setEditedItem(updated);
      toast.success('Đã duyệt đề tài');
    } catch (error) {
      console.error('Failed to approve DeTai:', error);
      toast.error('Lỗi khi duyệt đề tài');
    }
  };

  const handleReject = async () => {
    if (!editedItem) return;
    const updated = { ...editedItem, trangThai: 'bi_tu_choi' as const };
    try {
      if (onReject) {
        await onReject(updated);
      }
      setEditedItem(updated);
      toast.success('Đã từ chối đề tài');
    } catch (error) {
      console.error('Failed to reject DeTai:', error);
      toast.error('Lỗi khi từ chối đề tài');
    }
  };

  const studentPct = Math.round((editedItem.soLuongSV / editedItem.soLuongSVMax) * 100);

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
                      Hủy
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave} className="gap-1.5">
                      <Save className="h-4 w-4" />
                      Lưu
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

            {/* Title area */}
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
            <Tabs defaultValue="overview" className="flex flex-1 flex-col overflow-hidden">
              <TabsList className="mx-5 mt-3 w-auto justify-start bg-transparent p-0 border-b border-border rounded-none">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.overview}
                </TabsTrigger>
                <TabsTrigger value="students" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.students}
                </TabsTrigger>
                <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 pb-2 text-sm">
                  {t.detail.documents}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="m-0 px-5 py-4">
                  <motion.div variants={tabContentVariants} initial="initial" animate="animate" className="space-y-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.supervisor}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{editedItem.giangVien}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.field}</p>
                      <div className="mt-1 flex gap-1.5">
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{editedItem.linhVuc}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.description}</p>
                      {isEditing ? (
                        <Textarea
                          value={editedItem.mo_ta}
                          onChange={(e) => setEditedItem(prev => prev ? { ...prev, mo_ta: e.target.value } : prev)}
                          className="mt-1 text-sm min-h-[100px]"
                        />
                      ) : (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{editedItem.mo_ta}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t.detail.registered_students}: {editedItem.soLuongSV}/{editedItem.soLuongSVMax}
                      </p>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                        <motion.div
                          className="h-full rounded-full bg-foreground"
                          initial={{ width: 0 }}
                          animate={{ width: `${studentPct}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{studentPct}%</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.created_date}</p>
                        <p className="mt-1 text-sm text-foreground">{editedItem.ngayTao}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.detail.semester}</p>
                        <p className="mt-1 text-sm text-foreground">{editedItem.hocKy}</p>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="students" className="m-0 px-5 py-4">
                  <motion.div variants={tabContentVariants} initial="initial" animate="animate">
                    {editedItem.soLuongSV > 0 ? (
                      <div className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Trần Văn Bảo</p>
                            <p className="font-mono text-xs text-muted-foreground">20110001</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status="dang_thuc_hien" />
                            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                              Xem LV <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa có sinh viên đăng ký</p>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="documents" className="m-0 px-5 py-4">
                  <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                    {mockDocuments.map((doc) => (
                      <motion.div
                        key={doc.name}
                        variants={staggerItem}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/30"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer */}
            {editedItem.trangThai === 'cho_duyet' && (
              <div className="border-t border-border px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{t.detail.keyboard_hint}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReject} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      {t.detail.reject}
                    </Button>
                    <Button size="sm" onClick={handleApprove}>
                      {t.detail.approve}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {editedItem.trangThai !== 'cho_duyet' && (
              <div className="border-t border-border px-5 py-3">
                <p className="text-xs text-muted-foreground text-center">{t.detail.keyboard_hint}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
