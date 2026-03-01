import { subMinutes, subHours, subDays } from 'date-fns';

export type NotificationType =
  // ADMIN
  | 'de_tai_cho_duyet'
  | 'sv_nop_bao_cao'
  // GV
  | 'de_tai_duoc_duyet'
  | 'de_tai_bi_tu_choi'
  | 'tin_nhan_sv'
  | 'lich_bao_ve'
  // SV
  | 'ket_qua_bao_ve'
  | 'deadline_sap_den'
  // SYSTEM
  | 'system';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  entityType?: 'de_tai' | 'luan_van' | 'sinh_vien' | 'giang_vien' | 'hoi_dong' | 'moc_tien_do' | 'system';
  entityId?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface Notification extends NotificationPayload {
  id: string;
  read: boolean;
  createdAt: Date;
}

export const NOTIFICATION_TYPES_CONFIG: Record<
  NotificationType,
  { dot: string; icon: string; label: string; color: string; bgAccent: string; borderAccent: string }
> = {
  // ADMIN nhận
  de_tai_cho_duyet: {
    dot: 'bg-amber-400',
    icon: '📋',
    label: 'Đề tài chờ duyệt',
    color: 'text-amber-600',
    bgAccent: 'bg-amber-50 dark:bg-amber-950/30',
    borderAccent: 'border-l-4 border-amber-400',
  },
  sv_nop_bao_cao: {
    dot: 'bg-blue-400',
    icon: '📄',
    label: 'Sinh viên nộp báo cáo',
    color: 'text-blue-600',
    bgAccent: 'bg-blue-50 dark:bg-blue-950/30',
    borderAccent: 'border-l-4 border-blue-400',
  },

  // GV nhận
  de_tai_duoc_duyet: {
    dot: 'bg-emerald-400',
    icon: '✅',
    label: 'Đề tài được duyệt',
    color: 'text-emerald-600',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderAccent: 'border-l-4 border-emerald-400',
  },
  de_tai_bi_tu_choi: {
    dot: 'bg-red-400',
    icon: '❌',
    label: 'Đề tài bị từ chối',
    color: 'text-red-600',
    bgAccent: 'bg-red-50 dark:bg-red-950/30',
    borderAccent: 'border-l-4 border-red-400',
  },
  tin_nhan_sv: {
    dot: 'bg-violet-400',
    icon: '💬',
    label: 'Tin nhắn từ sinh viên',
    color: 'text-violet-600',
    bgAccent: 'bg-violet-50 dark:bg-violet-950/30',
    borderAccent: 'border-l-4 border-violet-400',
  },
  lich_bao_ve: {
    dot: 'bg-orange-400',
    icon: '📅',
    label: 'Lịch bảo vệ',
    color: 'text-orange-600',
    bgAccent: 'bg-orange-50 dark:bg-orange-950/30',
    borderAccent: 'border-l-4 border-orange-400',
  },

  // SV nhận
  ket_qua_bao_ve: {
    dot: 'bg-emerald-400',
    icon: '🎓',
    label: 'Kết quả bảo vệ',
    color: 'text-emerald-600',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderAccent: 'border-l-4 border-emerald-400',
  },
  deadline_sap_den: {
    dot: 'bg-red-500',
    icon: '⏰',
    label: 'Deadline sắp đến',
    color: 'text-red-600',
    bgAccent: 'bg-red-50 dark:bg-red-950/30',
    borderAccent: 'border-l-4 border-red-500',
  },

  // SYSTEM
  system: {
    dot: 'bg-zinc-400',
    icon: '⚙️',
    label: 'Hệ thống',
    color: 'text-zinc-600',
    bgAccent: 'bg-zinc-50 dark:bg-zinc-900/30',
    borderAccent: 'border-l-4 border-zinc-400',
  }
};

const now = new Date();

export const MOCK_NOTIFICATIONS_FULL: Notification[] = [
  // Hôm nay — 3 chưa đọc
  {
    id: 'n1',
    type: 'de_tai_duoc_duyet',
    title: 'Đề tài được duyệt',
    body: '"Xây dựng hệ thống AI nhận diện khuôn mặt" đã được Khoa CNTT duyệt.',
    read: false,
    createdAt: subMinutes(now, 2),
    entityType: 'de_tai',
    entityId: 'dt-001',
    ctaLabel: 'Xem đề tài →',
    ctaHref: '/de-tai',
  },
  {
    id: 'n2',
    type: 'sv_nop_bao_cao',
    title: 'Sinh viên nộp báo cáo',
    body: 'Nguyễn Văn A (20110001) vừa nộp Báo cáo tiến độ tháng 3.',
    read: false,
    createdAt: subHours(now, 1),
    entityType: 'luan_van',
    entityId: 'lv-001',
    ctaLabel: 'Xem báo cáo →',
    ctaHref: '/luan-van',
  },
  {
    id: 'n3',
    type: 'tin_nhan_sv',
    title: 'Tin nhắn từ sinh viên',
    body: 'Trần Văn B: "Thầy ơi em có thể đổi framework từ Vue sang React không ạ?"',
    read: false,
    createdAt: subHours(now, 3),
    entityType: 'sinh_vien',
    entityId: 'sv-002',
    ctaLabel: 'Xem hồ sơ →',
    ctaHref: '/sinh-vien',
  },

  // Hôm qua — 2 đã đọc
  {
    id: 'n4',
    type: 'lich_bao_ve',
    title: 'Lịch bảo vệ xác nhận',
    body: 'HĐ-05: 09:00 ngày 15/03/2026, Phòng A204.',
    read: true,
    createdAt: subDays(now, 1),
    entityType: 'hoi_dong',
    entityId: 'hd-005',
    ctaLabel: 'Xem hội đồng →',
    ctaHref: '/hoi-dong',
  },
  {
    id: 'n5',
    type: 'de_tai_bi_tu_choi',
    title: 'Đề tài bị từ chối',
    body: '"Nghiên cứu blockchain" bị từ chối. Lý do: Chủ đề quá rộng, cần thu hẹp phạm vi.',
    read: true,
    createdAt: subDays(now, 1),
    entityType: 'de_tai',
    entityId: 'dt-002',
    ctaLabel: 'Xem đề tài →',
    ctaHref: '/de-tai',
  },

  // Tuần này
  {
    id: 'n6',
    type: 'deadline_sap_den',
    title: '⏰ Deadline sắp đến',
    body: 'Còn 3 ngày để nộp Báo cáo chương 3. Hạn: 05/03/2026.',
    read: true,
    createdAt: subDays(now, 3),
    entityType: 'moc_tien_do',
    entityId: 'mtd-003',
    ctaLabel: 'Xem lịch →',
    ctaHref: '/lich-bao-ve',
  },
  {
    id: 'n7',
    type: 'ket_qua_bao_ve',
    title: '🎓 Kết quả bảo vệ',
    body: 'Chúc mừng! Bạn đã bảo vệ thành công với điểm 8.5/10.',
    read: true,
    createdAt: subDays(now, 4),
    entityType: 'luan_van',
    entityId: 'lv-001',
    ctaLabel: 'Xem kết quả →',
    ctaHref: '/luan-van',
  },
  {
    id: 'n8',
    type: 'de_tai_cho_duyet',
    title: 'Đề tài chờ duyệt mới',
    body: 'TS. Nguyễn Văn C vừa trình đề xuất 3 đề tài mới.',
    read: true,
    createdAt: subDays(now, 5),
    entityType: 'de_tai',
    entityId: 'dt-003',
    ctaLabel: 'Duyệt đề tài →',
    ctaHref: '/de-tai',
  },
];

export const MOCK_NOTIFICATIONS_TOSEND: NotificationPayload[] = [
  ...MOCK_NOTIFICATIONS_FULL.map(({ id, read, createdAt, ...payload }) => payload),
];

export function randomMockNotification(): NotificationPayload {
  const index = Math.floor(Math.random() * MOCK_NOTIFICATIONS_TOSEND.length);
  return MOCK_NOTIFICATIONS_TOSEND[index];
}
