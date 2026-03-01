export type NotificationType = 'submission' | 'approval' | 'rejection' | 'defense' | 'deadline' | 'comment' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'submission',
    title: 'Nộp báo cáo tiến độ',
    message: 'Trần Văn Bảo đã nộp báo cáo tiến độ tuần 6 cho đề tài "ML trong phát hiện gian lận tài chính"',
    time: '5 phút trước',
    read: false,
  },
  {
    id: 'n2',
    type: 'approval',
    title: 'Đề tài được duyệt',
    message: 'Khoa đã duyệt đề tài "Hệ thống IoT giám sát nông nghiệp" của Lê Thị Cẩm',
    time: '30 phút trước',
    read: false,
  },
  {
    id: 'n3',
    type: 'defense',
    title: 'Lịch bảo vệ sắp tới',
    message: 'Hội đồng HĐ-01 sẽ bảo vệ vào ngày 15/03/2025 lúc 08:00 tại phòng A301',
    time: '1 giờ trước',
    read: false,
  },
  {
    id: 'n4',
    type: 'comment',
    title: 'Nhận xét từ GVHD',
    message: 'TS. Nguyễn Văn An nhận xét: "Cần bổ sung phần thực nghiệm chương 4"',
    time: '2 giờ trước',
    read: true,
  },
  {
    id: 'n5',
    type: 'deadline',
    title: 'Sắp hết hạn nộp',
    message: 'Hoàng Văn Hải còn 2 ngày để nộp bản nháp luận văn',
    time: '3 giờ trước',
    read: true,
  },
  {
    id: 'n6',
    type: 'rejection',
    title: 'Đề tài bị từ chối',
    message: 'Đề tài "E-commerce microservices" của TS. Hoàng Văn Ếch đã bị từ chối do trùng lặp nội dung',
    time: '5 giờ trước',
    read: true,
  },
  {
    id: 'n7',
    type: 'submission',
    title: 'Nộp luận văn chính thức',
    message: 'Nguyễn Minh Đức đã nộp bản chính thức luận văn "Nhận diện khuôn mặt điểm danh"',
    time: '1 ngày trước',
    read: true,
  },
  {
    id: 'n8',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống đã cập nhật danh sách hội đồng bảo vệ Đợt 1 - HK2 2024-2025',
    time: '1 ngày trước',
    read: true,
  },
  {
    id: 'n9',
    type: 'approval',
    title: 'Đề tài được duyệt',
    message: 'Khoa đã duyệt đề tài "Quản lý thư viện số thông minh" của Vũ Thị Khánh',
    time: '2 ngày trước',
    read: true,
  },
  {
    id: 'n10',
    type: 'defense',
    title: 'Kết quả bảo vệ',
    message: 'Nguyễn Thị Lan đã bảo vệ thành công luận văn với điểm tổng hợp 8.8 - Xuất sắc',
    time: '3 ngày trước',
    read: true,
  },
];
