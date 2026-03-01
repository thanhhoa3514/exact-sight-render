import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Edit, MoreHorizontal, User, FileText, TrendingUp, Clock,
  Mail, ChevronRight, BookOpen, AlertTriangle, CheckCircle2, Circle,
  MessageSquare, Paperclip, Save, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { SinhVien, StudentStatus } from '@/data/mock';
import { studentStatusConfig } from '@/data/mock';
import StatusBadgeStudent from '@/components/shared/StatusBadgeStudent';

interface Props {
  item: SinhVien | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedItem: SinhVien) => Promise<void> | void;
}

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.2 } },
};

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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${score * 10}%` }} />
      </div>
      <span className="w-8 text-right text-sm font-bold text-foreground">{score.toFixed(1)}</span>
    </div>
  );
}

function getGrade(score: number) {
  if (score >= 9) return { label: 'Xuất sắc', stars: 5 };
  if (score >= 8) return { label: 'Giỏi', stars: 4 };
  if (score >= 7) return { label: 'Khá', stars: 3 };
  return { label: 'Trung bình', stars: 2 };
}

const activityIcons = {
  file: Paperclip,
  comment: MessageSquare,
  check: CheckCircle2,
  warning: AlertTriangle,
};

export default function StudentDetailPanel({ item, isOpen, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState('ho_so');
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<SinhVien | null>(null);

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
      toast.success('Đã lưu thay đổi thông tin sinh viên');
    } catch (error) {
      console.error('Failed to save student:', error);
      toast.error('Lỗi khi lưu thay đổi thông tin sinh viên');
    }
  };

  const tabs = [
    { key: 'ho_so', label: 'Hồ sơ', icon: User },
    { key: 'luan_van', label: 'Luận văn', icon: FileText },
    { key: 'tien_do', label: 'Tiến độ', icon: TrendingUp },
    { key: 'lich_su', label: 'Lịch sử', icon: Clock },
  ];

  const gpaPct = Math.round((item.gpa / 4.0) * 100);
  const tinChiPct = Math.round((item.tin_chi / item.tin_chi_max) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden" animate="visible" exit="hidden"
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            variants={panelVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col border-l border-border bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-muted-foreground">
                <X className="h-4 w-4" /> Đóng
              </Button>
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditedItem({ ...item }); }} className="gap-1.5 text-muted-foreground">
                      <XCircle className="h-4 w-4" /> Hủy
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave} className="gap-1.5">
                      <Save className="h-4 w-4" /> Lưu
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 text-muted-foreground">
                    <Edit className="h-4 w-4" /> Chỉnh sửa
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hero */}
            <div className="flex flex-col items-center border-b border-border px-5 py-5">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${getAvatarColor(editedItem.id)}`}>
                {getInitials(editedItem.name)}
              </div>
              {isEditing ? (
                <Input value={editedItem.name} onChange={(e) => setEditedItem(prev => prev ? { ...prev, name: e.target.value } : prev)} className="mt-3 text-center font-display text-lg font-bold h-9 w-64" />
              ) : (
                <h2 className="mt-3 font-display text-lg font-bold text-foreground">{editedItem.name}</h2>
              )}
              {isEditing ? (
                <div className="mt-1 flex gap-2">
                  <Input value={editedItem.mssv} onChange={(e) => setEditedItem(prev => prev ? { ...prev, mssv: e.target.value } : prev)} className="h-7 w-24 text-xs font-mono text-center" />
                  <Input value={editedItem.khoa_hoc} onChange={(e) => setEditedItem(prev => prev ? { ...prev, khoa_hoc: e.target.value } : prev)} className="h-7 w-20 text-xs font-mono text-center" />
                </div>
              ) : (
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{editedItem.mssv} · {editedItem.khoa_hoc}</p>
              )}
              {isEditing ? (
                <Input value={editedItem.chuyen_nganh} onChange={(e) => setEditedItem(prev => prev ? { ...prev, chuyen_nganh: e.target.value } : prev)} className="mt-1 h-7 text-xs w-48 text-center" />
              ) : (
                <p className="text-sm text-muted-foreground">{editedItem.chuyen_nganh}</p>
              )}
              <div className="mt-2">
                <StatusBadgeStudent status={editedItem.status} />
              </div>
            </div>

            {/* Tab Nav */}
            <div className="flex border-b border-border px-5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 ${activeTab === tab.key
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="px-5 py-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                  >
                    {activeTab === 'ho_so' && (
                      <div className="space-y-5">
                        <div>
                          <SectionTitle>Thông tin cá nhân</SectionTitle>
                          <div className="divide-y divide-border rounded-lg border border-border px-3">
                            {isEditing ? (
                              <div className="space-y-2 py-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Ngày sinh</span>
                                  <Input value={editedItem.ngay_sinh} onChange={(e) => setEditedItem(prev => prev ? { ...prev, ngay_sinh: e.target.value } : prev)} className="w-32 h-8 text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Giới tính</span>
                                  <Input value={editedItem.gioi_tinh} onChange={(e) => setEditedItem(prev => prev ? { ...prev, gioi_tinh: e.target.value } : prev)} className="w-24 h-8 text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Email</span>
                                  <Input value={editedItem.email} onChange={(e) => setEditedItem(prev => prev ? { ...prev, email: e.target.value } : prev)} className="w-48 h-8 text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">SĐT</span>
                                  <Input value={editedItem.sdt} onChange={(e) => setEditedItem(prev => prev ? { ...prev, sdt: e.target.value } : prev)} className="w-32 h-8 text-sm" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <InfoRow label="Ngày sinh" value={editedItem.ngay_sinh} />
                                <InfoRow label="Giới tính" value={editedItem.gioi_tinh} />
                                <InfoRow label="Email" value={editedItem.email} />
                                <InfoRow label="SĐT" value={editedItem.sdt} />
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <SectionTitle>Học tập</SectionTitle>
                          <div className="space-y-3 rounded-lg border border-border p-3">
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">GPA</span>
                                <span className="font-bold text-foreground">{item.gpa.toFixed(2)} / 4.0</span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                <motion.div
                                  className={`h-full rounded-full ${item.gpa >= 3.2 ? 'bg-emerald-500' : item.gpa >= 2.5 ? 'bg-info' : 'bg-destructive'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${gpaPct}%` }}
                                  transition={{ duration: 0.6, delay: 0.2 }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Tín chỉ</span>
                                <span className="font-bold text-foreground">{item.tin_chi} / {item.tin_chi_max}</span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                <motion.div
                                  className="h-full rounded-full bg-info"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${tinChiPct}%` }}
                                  transition={{ duration: 0.6, delay: 0.3 }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Xếp loại</span>
                              <span className="font-medium text-foreground">{item.xep_loai}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Lớp</span>
                              <span className="font-mono text-sm text-foreground">{item.lop}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <SectionTitle>Người hướng dẫn</SectionTitle>
                          {item.gvhd ? (
                            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                                {getInitials(item.gvhd.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">{item.gvhd.hoc_vi} {item.gvhd.name}</p>
                                <p className="text-xs text-muted-foreground">{item.gvhd.bo_mon}</p>
                                <p className="text-xs text-muted-foreground">{item.gvhd.email}</p>
                                <p className="mt-1 text-xs text-muted-foreground">Đang hướng dẫn {item.gvhd.sv_count} sinh viên</p>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed border-border p-4 text-center">
                              <p className="text-sm text-muted-foreground">Chưa được phân công giảng viên hướng dẫn</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'luan_van' && (
                      <div className="space-y-5">
                        {item.thesis ? (
                          <>
                            <div>
                              <p className="font-mono text-xs text-muted-foreground">{item.thesis.ma}</p>
                              <h3 className="mt-1 text-sm font-semibold text-foreground">{item.thesis.title}</h3>
                              <div className="mt-2">
                                <StatusBadgeStudent status={item.thesis.status} />
                              </div>
                            </div>
                            <div className="divide-y divide-border rounded-lg border border-border px-3">
                              {item.thesis.ngay_nop_cuoi && <InfoRow label="Nộp lần cuối" value={item.thesis.ngay_nop_cuoi} />}
                              {item.thesis.ty_le_dao_van != null && (
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-xs text-muted-foreground">Tỷ lệ đạo văn</span>
                                  <span className={`text-sm font-medium ${item.thesis.ty_le_dao_van <= 15 ? 'text-emerald-600' : 'text-destructive'}`}>
                                    {item.thesis.ty_le_dao_van}% {item.thesis.ty_le_dao_van <= 15 ? '✓' : '⚠'}
                                  </span>
                                </div>
                              )}
                              {item.thesis.dot_bao_ve && <InfoRow label="Đợt bảo vệ" value={item.thesis.dot_bao_ve} />}
                            </div>
                            {item.thesis.diem_tong_hop != null && (
                              <div>
                                <SectionTitle>Điểm số</SectionTitle>
                                <div className="space-y-2 rounded-lg border border-border p-3">
                                  {item.thesis.diem_gvhd != null && <ScoreBar label="GVHD" score={item.thesis.diem_gvhd} />}
                                  {item.thesis.diem_phan_bien != null && <ScoreBar label="Phản biện" score={item.thesis.diem_phan_bien} />}
                                  {item.thesis.diem_hoi_dong != null && <ScoreBar label="Hội đồng" score={item.thesis.diem_hoi_dong} />}
                                  <div className="border-t border-border pt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-semibold text-foreground">Tổng hợp: {item.thesis.diem_tong_hop.toFixed(1)}</span>
                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <span key={i} className={`text-sm ${i < getGrade(item.thesis!.diem_tong_hop!).stars ? 'text-warning' : 'text-muted-foreground/20'}`}>★</span>
                                        ))}
                                        <span className="ml-1 text-xs text-muted-foreground">{getGrade(item.thesis.diem_tong_hop).label}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center py-10 text-center">
                            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">Chưa đăng ký đề tài</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'tien_do' && (
                      <div>
                        {item.timeline.length > 0 ? (
                          <div className="relative ml-3 border-l-2 border-border pl-6 space-y-5">
                            {item.timeline.map(step => (
                              <div key={step.id} className="relative">
                                <span className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 ${step.done
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : step.current
                                    ? 'border-warning bg-warning text-white'
                                    : 'border-border bg-card'
                                  }`}>
                                  {step.done ? <CheckCircle2 className="h-3 w-3" /> : step.current ? <Clock className="h-3 w-3" /> : <Circle className="h-2 w-2 text-muted-foreground/30" />}
                                </span>
                                <p className={`text-sm font-medium ${step.done ? 'text-foreground' : step.current ? 'text-warning' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {step.date} {step.done && '✓'}
                                  {step.current && step.days_left != null && (
                                    <span className="ml-1 text-warning">← còn {step.days_left} ngày</span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-10 text-center">
                            <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">Chưa có tiến độ</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'lich_su' && (
                      <div>
                        {item.activities.length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(
                              item.activities.reduce((acc, a) => {
                                (acc[a.group] = acc[a.group] || []).push(a);
                                return acc;
                              }, {} as Record<string, typeof item.activities>)
                            ).map(([group, acts]) => (
                              <div key={group}>
                                <p className="mb-2 text-xs font-semibold text-muted-foreground">{group}</p>
                                <div className="space-y-2">
                                  {acts.map(a => {
                                    const Icon = activityIcons[a.icon];
                                    return (
                                      <div key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.icon === 'warning' ? 'text-warning' : a.icon === 'check' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-foreground">{a.content}</p>
                                          <p className="text-xs text-muted-foreground">{a.time}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-10 text-center">
                            <Clock className="mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">Chưa có hoạt động</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Gửi email
                  </Button>
                  {item.thesis && (
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" /> Xem luận văn
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">ESC để đóng · ← → để điều hướng</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
