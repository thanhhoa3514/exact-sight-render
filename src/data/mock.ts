export type ThesisStatus = 'cho_duyet' | 'da_duyet' | 'dang_thuc_hien' | 'hoan_thanh' | 'bi_tu_choi' | 'da_huy';

export interface DeTai {
  id: string;
  ma: string;
  ten: string;
  mo_ta: string;
  giangVien: string;
  linhVuc: string;
  soLuongSV: number;
  soLuongSVMax: number;
  trangThai: ThesisStatus;
  ngayTao: string;
  hocKy: string;
}

export interface LuanVan {
  id: string;
  ma: string;
  ten: string;
  sinhVien: string;
  mssv: string;
  giangVienHD: string;
  trangThai: ThesisStatus;
  diemGVHD?: number;
  diemPhanBien?: number;
  diemHoiDong?: number;
  ngayNop?: string;
  hocKy: string;
}

export interface Activity {
  id: string;
  content: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

export const statusConfig: Record<ThesisStatus, { label: string; variant: string }> = {
  cho_duyet: { label: 'Chờ duyệt', variant: 'warning' },
  da_duyet: { label: 'Đã duyệt', variant: 'info' },
  dang_thuc_hien: { label: 'Đang thực hiện', variant: 'violet' },
  hoan_thanh: { label: 'Hoàn thành', variant: 'success' },
  bi_tu_choi: { label: 'Từ chối', variant: 'destructive' },
  da_huy: { label: 'Đã hủy', variant: 'muted' },
};

export const mockDeTai: DeTai[] = [
  { id: '1', ma: 'DT-2025-001', ten: 'Ứng dụng Machine Learning trong phát hiện gian lận tài chính', mo_ta: 'Nghiên cứu và xây dựng mô hình ML phát hiện giao dịch gian lận', giangVien: 'TS. Nguyễn Văn An', linhVuc: 'AI/ML', soLuongSV: 1, soLuongSVMax: 2, trangThai: 'dang_thuc_hien', ngayTao: '2025-01-15', hocKy: 'HK2 2024-2025' },
  { id: '2', ma: 'DT-2025-002', ten: 'Xây dựng hệ thống IoT giám sát môi trường nông nghiệp', mo_ta: 'Thiết kế hệ thống IoT thu thập và phân tích dữ liệu môi trường', giangVien: 'PGS. Trần Thị Bình', linhVuc: 'IoT', soLuongSV: 2, soLuongSVMax: 2, trangThai: 'da_duyet', ngayTao: '2025-01-20', hocKy: 'HK2 2024-2025' },
  { id: '3', ma: 'DT-2025-003', ten: 'Phát triển ứng dụng di động quản lý sức khỏe cá nhân', mo_ta: 'Xây dựng app theo dõi sức khỏe với React Native', giangVien: 'TS. Lê Minh Cường', linhVuc: 'Mobile', soLuongSV: 1, soLuongSVMax: 1, trangThai: 'cho_duyet', ngayTao: '2025-02-01', hocKy: 'HK2 2024-2025' },
  { id: '4', ma: 'DT-2025-004', ten: 'Nghiên cứu Blockchain trong quản lý chuỗi cung ứng', mo_ta: 'Ứng dụng blockchain để truy xuất nguồn gốc sản phẩm', giangVien: 'TS. Phạm Đức Dũng', linhVuc: 'Blockchain', soLuongSV: 2, soLuongSVMax: 3, trangThai: 'dang_thuc_hien', ngayTao: '2025-01-10', hocKy: 'HK2 2024-2025' },
  { id: '5', ma: 'DT-2025-005', ten: 'Xây dựng chatbot hỗ trợ tư vấn tuyển sinh đại học', mo_ta: 'Phát triển chatbot NLP hỗ trợ trả lời câu hỏi tuyển sinh', giangVien: 'TS. Nguyễn Văn An', linhVuc: 'AI/ML', soLuongSV: 0, soLuongSVMax: 2, trangThai: 'cho_duyet', ngayTao: '2025-02-05', hocKy: 'HK2 2024-2025' },
  { id: '6', ma: 'DT-2025-006', ten: 'Hệ thống nhận diện khuôn mặt điểm danh sinh viên', mo_ta: 'Xây dựng hệ thống điểm danh tự động bằng computer vision', giangVien: 'PGS. Trần Thị Bình', linhVuc: 'AI/ML', soLuongSV: 1, soLuongSVMax: 2, trangThai: 'hoan_thanh', ngayTao: '2024-09-15', hocKy: 'HK1 2024-2025' },
  { id: '7', ma: 'DT-2025-007', ten: 'Thiết kế hệ thống e-commerce microservices', mo_ta: 'Xây dựng nền tảng thương mại điện tử với kiến trúc microservices', giangVien: 'TS. Hoàng Văn Ếch', linhVuc: 'Web', soLuongSV: 2, soLuongSVMax: 2, trangThai: 'bi_tu_choi', ngayTao: '2025-01-25', hocKy: 'HK2 2024-2025' },
  { id: '8', ma: 'DT-2025-008', ten: 'Ứng dụng Deep Learning trong chẩn đoán hình ảnh y tế', mo_ta: 'Sử dụng CNN để phân loại hình ảnh X-quang phổi', giangVien: 'TS. Lê Minh Cường', linhVuc: 'AI/ML', soLuongSV: 1, soLuongSVMax: 1, trangThai: 'dang_thuc_hien', ngayTao: '2025-01-18', hocKy: 'HK2 2024-2025' },
  { id: '9', ma: 'DT-2025-009', ten: 'Xây dựng hệ thống quản lý thư viện số thông minh', mo_ta: 'Phát triển hệ thống thư viện với khả năng tìm kiếm semantic', giangVien: 'TS. Phạm Đức Dũng', linhVuc: 'Web', soLuongSV: 1, soLuongSVMax: 2, trangThai: 'da_duyet', ngayTao: '2025-02-10', hocKy: 'HK2 2024-2025' },
  { id: '10', ma: 'DT-2025-010', ten: 'Phân tích dữ liệu mạng xã hội bằng NLP', mo_ta: 'Phân tích sentiment và trend từ dữ liệu Twitter/Facebook', giangVien: 'TS. Nguyễn Văn An', linhVuc: 'Data Science', soLuongSV: 0, soLuongSVMax: 2, trangThai: 'cho_duyet', ngayTao: '2025-02-12', hocKy: 'HK2 2024-2025' },
];

export const mockLuanVan: LuanVan[] = [
  { id: '1', ma: 'LV-2025-001', ten: 'Ứng dụng Machine Learning trong phát hiện gian lận tài chính', sinhVien: 'Trần Văn Bảo', mssv: '20110001', giangVienHD: 'TS. Nguyễn Văn An', trangThai: 'dang_thuc_hien', hocKy: 'HK2 2024-2025' },
  { id: '2', ma: 'LV-2025-002', ten: 'Hệ thống IoT giám sát nông nghiệp thông minh', sinhVien: 'Lê Thị Cẩm', mssv: '20110002', giangVienHD: 'PGS. Trần Thị Bình', trangThai: 'dang_thuc_hien', hocKy: 'HK2 2024-2025' },
  { id: '3', ma: 'LV-2025-003', ten: 'Hệ thống nhận diện khuôn mặt điểm danh', sinhVien: 'Nguyễn Minh Đức', mssv: '20110003', giangVienHD: 'PGS. Trần Thị Bình', trangThai: 'hoan_thanh', diemGVHD: 8.5, diemPhanBien: 8.0, diemHoiDong: 8.5, ngayNop: '2025-01-10', hocKy: 'HK1 2024-2025' },
  { id: '4', ma: 'LV-2025-004', ten: 'Blockchain trong quản lý chuỗi cung ứng', sinhVien: 'Phạm Thị Giang', mssv: '20110004', giangVienHD: 'TS. Phạm Đức Dũng', trangThai: 'dang_thuc_hien', hocKy: 'HK2 2024-2025' },
  { id: '5', ma: 'LV-2025-005', ten: 'Deep Learning chẩn đoán hình ảnh y tế', sinhVien: 'Hoàng Văn Hải', mssv: '20110005', giangVienHD: 'TS. Lê Minh Cường', trangThai: 'cho_duyet', hocKy: 'HK2 2024-2025' },
  { id: '6', ma: 'LV-2025-006', ten: 'Quản lý thư viện số thông minh', sinhVien: 'Vũ Thị Khánh', mssv: '20110006', giangVienHD: 'TS. Phạm Đức Dũng', trangThai: 'da_duyet', hocKy: 'HK2 2024-2025' },
];

export const mockActivities: Activity[] = [
  { id: '1', content: 'TS. Nguyễn Văn An đã duyệt đề tài "ML trong phát hiện gian lận"', time: '5 phút trước', type: 'success' },
  { id: '2', content: 'Trần Văn Bảo nộp báo cáo tiến độ tuần 4', time: '15 phút trước', type: 'info' },
  { id: '3', content: 'Đề tài "E-commerce microservices" bị từ chối', time: '1 giờ trước', type: 'warning' },
  { id: '4', content: 'Lịch bảo vệ HĐ-01 đã được cập nhật', time: '2 giờ trước', type: 'info' },
  { id: '5', content: 'Lê Thị Cẩm đã đăng ký đề tài IoT nông nghiệp', time: '3 giờ trước', type: 'success' },
  { id: '6', content: 'PGS. Trần Thị Bình chấm điểm LV-2025-003: 8.5', time: '5 giờ trước', type: 'info' },
];

export const statusChartData = [
  { name: 'Đang thực hiện', value: 45, fill: 'hsl(258, 90%, 66%)' },
  { name: 'Chờ duyệt', value: 28, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Đã duyệt', value: 22, fill: 'hsl(217, 91%, 60%)' },
  { name: 'Hoàn thành', value: 35, fill: 'hsl(160, 84%, 39%)' },
  { name: 'Từ chối', value: 8, fill: 'hsl(0, 84%, 60%)' },
  { name: 'Đã hủy', value: 4, fill: 'hsl(220, 9%, 70%)' },
];
