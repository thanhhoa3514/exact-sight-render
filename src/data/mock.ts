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

// ── Student types & data ─────────────────────────────────

export type StudentStatus = 'chua_dang_ky' | 'da_dang_ky' | 'dang_thuc_hien' | 'cho_bao_ve' | 'hoan_thanh';

export const studentStatusConfig: Record<StudentStatus, { label: string; variant: string }> = {
  chua_dang_ky:   { label: 'Chưa đăng ký',   variant: 'muted' },
  da_dang_ky:     { label: 'Đã đăng ký',     variant: 'info' },
  dang_thuc_hien: { label: 'Đang thực hiện', variant: 'violet' },
  cho_bao_ve:     { label: 'Chờ bảo vệ',     variant: 'warning' },
  hoan_thanh:     { label: 'Hoàn thành',     variant: 'success' },
};

export interface StudentThesis {
  id: string;
  ma: string;
  title: string;
  status: StudentStatus;
  progress_pct: number;
  is_overdue: boolean;
  ngay_nop_cuoi?: string;
  ty_le_dao_van?: number;
  dot_bao_ve?: string;
  diem_gvhd?: number;
  diem_phan_bien?: number;
  diem_hoi_dong?: number;
  diem_tong_hop?: number;
}

export interface StudentGVHD {
  id: string;
  name: string;
  hoc_vi: string;
  bo_mon: string;
  email: string;
  sv_count: number;
}

export interface StudentTimeline {
  id: string;
  label: string;
  date: string;
  done: boolean;
  current?: boolean;
  days_left?: number;
}

export interface StudentActivity {
  id: string;
  content: string;
  time: string;
  icon: 'file' | 'comment' | 'check' | 'warning';
  group: string; // "Hôm nay", "Hôm qua", etc.
}

export interface SinhVien {
  id: string;
  name: string;
  mssv: string;
  khoa_hoc: string;
  chuyen_nganh: string;
  gpa: number;
  ngay_sinh: string;
  gioi_tinh: string;
  email: string;
  sdt: string;
  lop: string;
  tin_chi: number;
  tin_chi_max: number;
  xep_loai: string;
  status: StudentStatus;
  gvhd: StudentGVHD | null;
  thesis: StudentThesis | null;
  timeline: StudentTimeline[];
  activities: StudentActivity[];
}

const gvhd1: StudentGVHD = { id: 'gv1', name: 'Nguyễn Văn An', hoc_vi: 'TS.', bo_mon: 'Khoa học Máy tính', email: 'an.nv@university.edu.vn', sv_count: 8 };
const gvhd2: StudentGVHD = { id: 'gv2', name: 'Trần Thị Bình', hoc_vi: 'PGS.', bo_mon: 'Hệ thống Thông tin', email: 'binh.tt@university.edu.vn', sv_count: 6 };
const gvhd3: StudentGVHD = { id: 'gv3', name: 'Lê Minh Cường', hoc_vi: 'TS.', bo_mon: 'Kỹ thuật Phần mềm', email: 'cuong.lm@university.edu.vn', sv_count: 5 };
const gvhd4: StudentGVHD = { id: 'gv4', name: 'Phạm Đức Dũng', hoc_vi: 'TS.', bo_mon: 'Mạng máy tính', email: 'dung.pd@university.edu.vn', sv_count: 4 };

const defaultTimeline: StudentTimeline[] = [
  { id: 't1', label: 'Nộp đề cương', date: '15/01', done: true },
  { id: 't2', label: 'Báo cáo tuần 4', date: '01/02', done: true },
  { id: 't3', label: 'Nộp bản nháp', date: '28/02', done: false, current: true, days_left: 2 },
  { id: 't4', label: 'Nộp bản chính thức', date: '10/03', done: false },
  { id: 't5', label: 'Bảo vệ', date: '15/03', done: false },
];

const defaultActivities: StudentActivity[] = [
  { id: 'a1', content: 'Nộp báo cáo tiến độ tuần 6', time: '10:30', icon: 'file', group: 'Hôm nay' },
  { id: 'a2', content: 'GVHD nhận xét: "Cần bổ sung phần thực nghiệm"', time: '15:00', icon: 'comment', group: 'Hôm qua' },
  { id: 'a3', content: 'Đề tài được duyệt bởi Admin', time: '09:00', icon: 'check', group: '3 ngày trước' },
];

export const mockSinhVien: SinhVien[] = [
  {
    id: '1', name: 'Trần Văn Bảo', mssv: '20110001', khoa_hoc: 'K2021', chuyen_nganh: 'Kỹ thuật Phần mềm',
    gpa: 3.45, ngay_sinh: '01/01/2003', gioi_tinh: 'Nam', email: 'bao.tv@student.edu.vn', sdt: '0901 234 567',
    lop: 'KTPM2021A', tin_chi: 118, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'dang_thuc_hien',
    gvhd: gvhd1,
    thesis: { id: 'th1', ma: 'DT-2025-001', title: 'Ứng dụng Machine Learning trong phát hiện gian lận tài chính', status: 'dang_thuc_hien', progress_pct: 60, is_overdue: false, ngay_nop_cuoi: '20/02/2025 14:32', ty_le_dao_van: 8, dot_bao_ve: 'Đợt 1 - HK2 2024-2025' },
    timeline: defaultTimeline, activities: defaultActivities,
  },
  {
    id: '2', name: 'Lê Thị Cẩm', mssv: '20110002', khoa_hoc: 'K2021', chuyen_nganh: 'Hệ thống Thông tin',
    gpa: 3.58, ngay_sinh: '15/03/2003', gioi_tinh: 'Nữ', email: 'cam.lt@student.edu.vn', sdt: '0912 345 678',
    lop: 'HTTT2021A', tin_chi: 120, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'dang_thuc_hien',
    gvhd: gvhd2,
    thesis: { id: 'th2', ma: 'DT-2025-002', title: 'Hệ thống IoT giám sát nông nghiệp thông minh', status: 'dang_thuc_hien', progress_pct: 45, is_overdue: false, dot_bao_ve: 'Đợt 1 - HK2 2024-2025' },
    timeline: defaultTimeline, activities: defaultActivities,
  },
  {
    id: '3', name: 'Nguyễn Minh Đức', mssv: '20110003', khoa_hoc: 'K2021', chuyen_nganh: 'Khoa học Máy tính',
    gpa: 3.72, ngay_sinh: '22/07/2003', gioi_tinh: 'Nam', email: 'duc.nm@student.edu.vn', sdt: '0923 456 789',
    lop: 'KHMT2021A', tin_chi: 135, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'hoan_thanh',
    gvhd: gvhd2,
    thesis: { id: 'th3', ma: 'DT-2025-003', title: 'Hệ thống nhận diện khuôn mặt điểm danh', status: 'hoan_thanh', progress_pct: 100, is_overdue: false, ngay_nop_cuoi: '10/01/2025', ty_le_dao_van: 5, dot_bao_ve: 'Đợt 2 - HK1 2024-2025', diem_gvhd: 8.5, diem_phan_bien: 8.0, diem_hoi_dong: 8.5, diem_tong_hop: 8.3 },
    timeline: defaultTimeline.map(t => ({ ...t, done: true, current: false })),
    activities: [
      { id: 'a1', content: 'Hoàn thành bảo vệ luận văn - Đạt', time: '14:00', icon: 'check', group: '2 tuần trước' },
      { id: 'a2', content: 'Nộp bản chính thức luận văn', time: '09:00', icon: 'file', group: '3 tuần trước' },
    ],
  },
  {
    id: '4', name: 'Phạm Thị Giang', mssv: '20110004', khoa_hoc: 'K2021', chuyen_nganh: 'Kỹ thuật Phần mềm',
    gpa: 3.30, ngay_sinh: '10/11/2003', gioi_tinh: 'Nữ', email: 'giang.pt@student.edu.vn', sdt: '0934 567 890',
    lop: 'KTPM2021B', tin_chi: 115, tin_chi_max: 135, xep_loai: 'Khá', status: 'dang_thuc_hien',
    gvhd: gvhd4,
    thesis: { id: 'th4', ma: 'DT-2025-004', title: 'Blockchain trong quản lý chuỗi cung ứng', status: 'dang_thuc_hien', progress_pct: 35, is_overdue: false },
    timeline: defaultTimeline, activities: defaultActivities,
  },
  {
    id: '5', name: 'Hoàng Văn Hải', mssv: '20110005', khoa_hoc: 'K2021', chuyen_nganh: 'Trí tuệ Nhân tạo',
    gpa: 2.30, ngay_sinh: '05/05/2003', gioi_tinh: 'Nam', email: 'hai.hv@student.edu.vn', sdt: '0945 678 901',
    lop: 'TTNT2021A', tin_chi: 100, tin_chi_max: 135, xep_loai: 'Trung bình', status: 'dang_thuc_hien',
    gvhd: gvhd3,
    thesis: { id: 'th5', ma: 'DT-2025-005', title: 'Deep Learning chẩn đoán hình ảnh y tế', status: 'dang_thuc_hien', progress_pct: 20, is_overdue: true },
    timeline: defaultTimeline, activities: [
      { id: 'a1', content: '⚠ Trễ deadline nộp báo cáo tuần 4', time: '—', icon: 'warning', group: 'Hôm nay' },
      ...defaultActivities,
    ],
  },
  {
    id: '6', name: 'Vũ Thị Khánh', mssv: '20110006', khoa_hoc: 'K2021', chuyen_nganh: 'Hệ thống Thông tin',
    gpa: 3.15, ngay_sinh: '18/09/2003', gioi_tinh: 'Nữ', email: 'khanh.vt@student.edu.vn', sdt: '0956 789 012',
    lop: 'HTTT2021B', tin_chi: 112, tin_chi_max: 135, xep_loai: 'Khá', status: 'da_dang_ky',
    gvhd: gvhd4,
    thesis: { id: 'th6', ma: 'DT-2025-006', title: 'Quản lý thư viện số thông minh', status: 'da_dang_ky', progress_pct: 10, is_overdue: false },
    timeline: [defaultTimeline[0]], activities: [],
  },
  {
    id: '7', name: 'Lê Thu Hà', mssv: '20110007', khoa_hoc: 'K2021', chuyen_nganh: 'Khoa học Máy tính',
    gpa: 3.10, ngay_sinh: '25/12/2003', gioi_tinh: 'Nữ', email: 'ha.lt@student.edu.vn', sdt: '0967 890 123',
    lop: 'KHMT2021B', tin_chi: 108, tin_chi_max: 135, xep_loai: 'Khá', status: 'chua_dang_ky',
    gvhd: null, thesis: null, timeline: [], activities: [],
  },
  {
    id: '8', name: 'Đỗ Quang Minh', mssv: '20110008', khoa_hoc: 'K2021', chuyen_nganh: 'Kỹ thuật Phần mềm',
    gpa: 3.65, ngay_sinh: '30/06/2003', gioi_tinh: 'Nam', email: 'minh.dq@student.edu.vn', sdt: '0978 901 234',
    lop: 'KTPM2021A', tin_chi: 125, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'cho_bao_ve',
    gvhd: gvhd1,
    thesis: { id: 'th8', ma: 'DT-2025-008', title: 'Xây dựng hệ thống chatbot tư vấn tuyển sinh', status: 'cho_bao_ve', progress_pct: 90, is_overdue: false, ngay_nop_cuoi: '25/02/2025', ty_le_dao_van: 6, dot_bao_ve: 'Đợt 1 - HK2 2024-2025' },
    timeline: defaultTimeline.map((t, i) => i < 4 ? { ...t, done: true, current: false } : { ...t, current: true }),
    activities: defaultActivities,
  },
  {
    id: '9', name: 'Nguyễn Thị Lan', mssv: '20110009', khoa_hoc: 'K2021', chuyen_nganh: 'Trí tuệ Nhân tạo',
    gpa: 3.88, ngay_sinh: '14/02/2003', gioi_tinh: 'Nữ', email: 'lan.nt@student.edu.vn', sdt: '0989 012 345',
    lop: 'TTNT2021A', tin_chi: 130, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'hoan_thanh',
    gvhd: gvhd1,
    thesis: { id: 'th9', ma: 'DT-2025-009', title: 'Phân tích dữ liệu mạng xã hội bằng NLP', status: 'hoan_thanh', progress_pct: 100, is_overdue: false, diem_gvhd: 9.0, diem_phan_bien: 8.5, diem_hoi_dong: 9.0, diem_tong_hop: 8.8, ty_le_dao_van: 3, dot_bao_ve: 'Đợt 2 - HK1 2024-2025' },
    timeline: defaultTimeline.map(t => ({ ...t, done: true, current: false })),
    activities: [{ id: 'a1', content: 'Hoàn thành bảo vệ - Xuất sắc', time: '10:00', icon: 'check', group: '1 tuần trước' }],
  },
  {
    id: '10', name: 'Bùi Văn Nam', mssv: '20110010', khoa_hoc: 'K2021', chuyen_nganh: 'Mạng Máy tính',
    gpa: 2.85, ngay_sinh: '08/08/2003', gioi_tinh: 'Nam', email: 'nam.bv@student.edu.vn', sdt: '0990 123 456',
    lop: 'MMT2021A', tin_chi: 105, tin_chi_max: 135, xep_loai: 'Khá', status: 'chua_dang_ky',
    gvhd: null, thesis: null, timeline: [], activities: [],
  },
  {
    id: '11', name: 'Trương Thị Oanh', mssv: '20110011', khoa_hoc: 'K2021', chuyen_nganh: 'Kỹ thuật Phần mềm',
    gpa: 3.52, ngay_sinh: '20/04/2003', gioi_tinh: 'Nữ', email: 'oanh.tt@student.edu.vn', sdt: '0901 234 999',
    lop: 'KTPM2021B', tin_chi: 122, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'cho_bao_ve',
    gvhd: gvhd3,
    thesis: { id: 'th11', ma: 'DT-2025-011', title: 'Ứng dụng di động quản lý sức khỏe cá nhân', status: 'cho_bao_ve', progress_pct: 85, is_overdue: false, ngay_nop_cuoi: '22/02/2025', ty_le_dao_van: 7, dot_bao_ve: 'Đợt 1 - HK2 2024-2025' },
    timeline: defaultTimeline.map((t, i) => i < 3 ? { ...t, done: true, current: false } : i === 3 ? { ...t, current: true } : t),
    activities: defaultActivities,
  },
  {
    id: '12', name: 'Lý Hoàng Phúc', mssv: '20110012', khoa_hoc: 'K2021', chuyen_nganh: 'Khoa học Máy tính',
    gpa: 3.40, ngay_sinh: '12/10/2003', gioi_tinh: 'Nam', email: 'phuc.lh@student.edu.vn', sdt: '0912 555 888',
    lop: 'KHMT2021A', tin_chi: 116, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'dang_thuc_hien',
    gvhd: gvhd2,
    thesis: { id: 'th12', ma: 'DT-2025-012', title: 'Xây dựng hệ thống e-commerce microservices', status: 'dang_thuc_hien', progress_pct: 50, is_overdue: false },
    timeline: defaultTimeline, activities: defaultActivities,
  },
  {
    id: '13', name: 'Võ Minh Quân', mssv: '20110013', khoa_hoc: 'K2022', chuyen_nganh: 'Trí tuệ Nhân tạo',
    gpa: 2.40, ngay_sinh: '03/03/2004', gioi_tinh: 'Nam', email: 'quan.vm@student.edu.vn', sdt: '0923 666 777',
    lop: 'TTNT2022A', tin_chi: 85, tin_chi_max: 135, xep_loai: 'Trung bình', status: 'chua_dang_ky',
    gvhd: null, thesis: null, timeline: [], activities: [],
  },
  {
    id: '14', name: 'Đặng Thị Rạng', mssv: '20110014', khoa_hoc: 'K2021', chuyen_nganh: 'Hệ thống Thông tin',
    gpa: 3.20, ngay_sinh: '27/11/2003', gioi_tinh: 'Nữ', email: 'rang.dt@student.edu.vn', sdt: '0934 777 888',
    lop: 'HTTT2021A', tin_chi: 119, tin_chi_max: 135, xep_loai: 'Khá', status: 'da_dang_ky',
    gvhd: gvhd1,
    thesis: { id: 'th14', ma: 'DT-2025-014', title: 'Hệ thống quản lý kho hàng thông minh', status: 'da_dang_ky', progress_pct: 5, is_overdue: false },
    timeline: [], activities: [],
  },
  {
    id: '15', name: 'Huỳnh Văn Sơn', mssv: '20110015', khoa_hoc: 'K2021', chuyen_nganh: 'Mạng Máy tính',
    gpa: 3.05, ngay_sinh: '16/07/2003', gioi_tinh: 'Nam', email: 'son.hv@student.edu.vn', sdt: '0945 888 999',
    lop: 'MMT2021A', tin_chi: 110, tin_chi_max: 135, xep_loai: 'Khá', status: 'dang_thuc_hien',
    gvhd: gvhd4,
    thesis: { id: 'th15', ma: 'DT-2025-015', title: 'Thiết kế mạng SDN cho doanh nghiệp vừa và nhỏ', status: 'dang_thuc_hien', progress_pct: 40, is_overdue: false },
    timeline: defaultTimeline, activities: defaultActivities,
  },
  {
    id: '16', name: 'Phan Thị Tuyết', mssv: '20110016', khoa_hoc: 'K2021', chuyen_nganh: 'Kỹ thuật Phần mềm',
    gpa: 3.78, ngay_sinh: '09/01/2003', gioi_tinh: 'Nữ', email: 'tuyet.pt@student.edu.vn', sdt: '0956 999 000',
    lop: 'KTPM2021A', tin_chi: 132, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'hoan_thanh',
    gvhd: gvhd3,
    thesis: { id: 'th16', ma: 'DT-2025-016', title: 'Phát triển Progressive Web App cho giáo dục trực tuyến', status: 'hoan_thanh', progress_pct: 100, is_overdue: false, diem_gvhd: 8.0, diem_phan_bien: 7.5, diem_hoi_dong: 8.0, diem_tong_hop: 7.8, ty_le_dao_van: 10, dot_bao_ve: 'Đợt 2 - HK1 2024-2025' },
    timeline: defaultTimeline.map(t => ({ ...t, done: true, current: false })),
    activities: [{ id: 'a1', content: 'Hoàn thành bảo vệ - Giỏi', time: '11:00', icon: 'check', group: '1 tuần trước' }],
  },
  {
    id: '17', name: 'Mai Xuân Uy', mssv: '20110017', khoa_hoc: 'K2022', chuyen_nganh: 'Khoa học Máy tính',
    gpa: 3.35, ngay_sinh: '21/05/2004', gioi_tinh: 'Nam', email: 'uy.mx@student.edu.vn', sdt: '0967 000 111',
    lop: 'KHMT2022A', tin_chi: 90, tin_chi_max: 135, xep_loai: 'Khá', status: 'chua_dang_ky',
    gvhd: null, thesis: null, timeline: [], activities: [],
  },
  {
    id: '18', name: 'Ngô Thị Vi', mssv: '20110018', khoa_hoc: 'K2021', chuyen_nganh: 'Trí tuệ Nhân tạo',
    gpa: 3.60, ngay_sinh: '02/06/2003', gioi_tinh: 'Nữ', email: 'vi.nt@student.edu.vn', sdt: '0978 111 222',
    lop: 'TTNT2021A', tin_chi: 128, tin_chi_max: 135, xep_loai: 'Giỏi', status: 'cho_bao_ve',
    gvhd: gvhd1,
    thesis: { id: 'th18', ma: 'DT-2025-018', title: 'Hệ thống gợi ý sản phẩm bằng Collaborative Filtering', status: 'cho_bao_ve', progress_pct: 92, is_overdue: false, ngay_nop_cuoi: '24/02/2025', ty_le_dao_van: 4, dot_bao_ve: 'Đợt 1 - HK2 2024-2025' },
    timeline: defaultTimeline.map((t, i) => i < 4 ? { ...t, done: true, current: false } : { ...t, current: true }),
    activities: defaultActivities,
  },
];
