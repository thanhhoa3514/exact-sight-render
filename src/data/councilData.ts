export type CouncilRole = 'Chủ tịch' | 'Thư ký' | 'Ủy viên' | 'Phản biện';
export type DefenseStatus = 'Chờ diễn ra' | 'Đang diễn ra' | 'Đã hoàn thành' | 'Cần chú ý';

export interface CouncilMember {
    id: string;
    name: string;
    role: CouncilRole;
    department: string;
    avatar_url?: string;
    email: string;
}

export interface DefenseSession {
    id: string;
    student_name: string;
    mssv: string;
    thesis_title: string;
    time_start: string; // HH:mm
    time_end: string;   // HH:mm
    room: string;
    status: DefenseStatus;
    score?: number;
}

export interface GradingCriteria {
    id: string;
    name: string;
    max_score: number;
    description: string;
}

export interface Council {
    id: string;
    name: string; // e.g. "HĐ-01 (HTTT)"
    field: string;
    date: string; // YYYY-MM-DD
    status: DefenseStatus;
    sessions_completed: number;
    sessions_total: number;
    members: CouncilMember[];
    sessions: DefenseSession[];
    criteria: GradingCriteria[]; // Rubric used by this council
}

// Generate realistic mock data
const MOCK_CRITERIA: GradingCriteria[] = [
    { id: 'c1', name: 'Hình thức & Cấu trúc', max_score: 2, description: 'Trình bày đúng format, rõ ràng, mạch lạc' },
    { id: 'c2', name: 'Tổng quan tài liệu', max_score: 2, description: 'Review các nghiên cứu liên quan đầy đủ' },
    { id: 'c3', name: 'Phương pháp & Thực nghiệm', max_score: 3, description: 'Phương pháp khoa học, kết quả đáng tin cậy' },
    { id: 'c4', name: 'Khả năng ứng dụng', max_score: 2, description: 'Phần mềm/Mô hình có tính ứng dụng thực tế' },
    { id: 'c5', name: 'Trình bày & Trả lời câu hỏi', max_score: 1, description: 'Bảo vệ tự tin, trả lời đúng trọng tâm' },
];

export const mockCouncils: Council[] = [
    {
        id: 'c-001',
        name: 'HĐ-01 (Công nghệ PM)',
        field: 'Công nghệ Phần mềm',
        date: '2024-03-15',
        status: 'Đang diễn ra',
        sessions_completed: 2,
        sessions_total: 5,
        criteria: MOCK_CRITERIA,
        members: [
            { id: 'm-01', name: 'TS. Nguyễn Văn A', role: 'Chủ tịch', department: 'CNPM', email: 'nva@university.edu.vn' },
            { id: 'm-02', name: 'ThS. Trần Thị B', role: 'Thư ký', department: 'CNPM', email: 'ttb@university.edu.vn' },
            { id: 'm-03', name: 'PGS.TS. Lê Đình C', role: 'Ủy viên', department: 'CNPM', email: 'ldc@university.edu.vn' },
            { id: 'm-04', name: 'TS. Phạm Hoàng D', role: 'Phản biện', department: 'KHMT', email: 'phd@university.edu.vn' },
        ],
        sessions: [
            { id: 's-01', student_name: 'Nguyễn Tiến Đạt', mssv: 'SV20201234', thesis_title: 'Hệ thống gợi ý khóa học dựa trên AI', time_start: '07:30', time_end: '08:15', room: 'Phòng 201-B1', status: 'Đã hoàn thành', score: 8.5 },
            { id: 's-02', student_name: 'Lê Minh Tâm', mssv: 'SV20205678', thesis_title: 'Ứng dụng Blockchain trong quản lý văn bằng', time_start: '08:15', time_end: '09:00', room: 'Phòng 201-B1', status: 'Đã hoàn thành', score: 7.0 },
            { id: 's-03', student_name: 'Trần Cẩm Ly', mssv: 'SV20209012', thesis_title: 'Nhận dạng cảm xúc qua giọng nói tiếng Việt', time_start: '09:15', time_end: '10:00', room: 'Phòng 201-B1', status: 'Đang diễn ra' },
            { id: 's-04', student_name: 'Phạm Hữu Nghĩa', mssv: 'SV20203456', thesis_title: 'Xây dựng Mini-App quản lý chi tiêu', time_start: '10:00', time_end: '10:45', room: 'Phòng 201-B1', status: 'Chờ diễn ra' },
            { id: 's-05', student_name: 'Hoàng Kim Dung', mssv: 'SV20207890', thesis_title: 'Tối ưu hóa logistics bằng thuật toán di truyền', time_start: '10:45', time_end: '11:30', room: 'Phòng 201-B1', status: 'Chờ diễn ra' },
        ]
    },
    {
        id: 'c-002',
        name: 'HĐ-02 (Hệ thống TT)',
        field: 'Hệ thống Thông tin',
        date: '2024-03-16',
        status: 'Chờ diễn ra',
        sessions_completed: 0,
        sessions_total: 4,
        criteria: MOCK_CRITERIA,
        members: [
            { id: 'm-05', name: 'TS. Vũ Minh E', role: 'Chủ tịch', department: 'HTTT', email: 'vme@university.edu.vn' },
            { id: 'm-06', name: 'ThS. Đặng Cầm F', role: 'Thư ký', department: 'HTTT', email: 'dcf@university.edu.vn' },
            { id: 'm-07', name: 'TS. Bùi Xuân G', role: 'Ủy viên', department: 'HTTT', email: 'bxg@university.edu.vn' },
        ],
        sessions: [
            { id: 's-06', student_name: 'Đinh Tuấn Anh', mssv: 'SV20201111', thesis_title: 'ERP cho doanh nghiệp thủy sản vừa và nhỏ', time_start: '13:30', time_end: '14:15', room: 'Phòng 202-B1', status: 'Chờ diễn ra' },
            { id: 's-07', student_name: 'Võ Thị Hồng', mssv: 'SV20202222', thesis_title: 'Phân tích dữ liệu khách hàng CRM', time_start: '14:15', time_end: '15:00', room: 'Phòng 202-B1', status: 'Chờ diễn ra' },
            { id: 's-08', student_name: 'Lý Kiến Quốc', mssv: 'SV20203333', thesis_title: 'Dự đoán rời bỏ của khách hàng viễn thông', time_start: '15:15', time_end: '16:00', room: 'Phòng 202-B1', status: 'Chờ diễn ra' },
            { id: 's-09', student_name: 'Cao Hoàng Long', mssv: 'SV20204444', thesis_title: 'Dashboard quản trị rủi ro tín dụng', time_start: '16:00', time_end: '16:45', room: 'Phòng 202-B1', status: 'Chờ diễn ra' },
        ]
    },
    {
        id: 'c-003',
        name: 'HĐ-03 (Khoa học MT)',
        field: 'Khoa học Máy tính',
        date: '2024-03-14',
        status: 'Đã hoàn thành',
        sessions_completed: 3,
        sessions_total: 3,
        criteria: MOCK_CRITERIA,
        members: [
            { id: 'm-04', name: 'TS. Phạm Hoàng D', role: 'Chủ tịch', department: 'KHMT', email: 'phd@university.edu.vn' },
            { id: 'm-08', name: 'ThS. Ngô Văn H', role: 'Thư ký', department: 'KHMT', email: 'nvh@university.edu.vn' },
            { id: 'm-01', name: 'TS. Nguyễn Văn A', role: 'Ủy viên', department: 'CNPM', email: 'nva@university.edu.vn' },
        ],
        sessions: [
            { id: 's-10', student_name: 'Hà Thế Ngọc', mssv: 'SV20205555', thesis_title: 'Tạo ảnh Deepfake sinh trắc học', time_start: '07:30', time_end: '08:15', room: 'Phòng 203-B1', status: 'Đã hoàn thành', score: 9.2 },
            { id: 's-11', student_name: 'Chu Bảo Toàn', mssv: 'SV20206666', thesis_title: 'Nhận dạng biển số xe môi trường thiếu sáng', time_start: '08:15', time_end: '09:00', room: 'Phòng 203-B1', status: 'Đã hoàn thành', score: 8.0 },
            { id: 's-12', student_name: 'Đỗ Tiến Dũng', mssv: 'SV20207777', thesis_title: 'Bot tự động phân loại văn bản luật', time_start: '09:15', time_end: '10:00', room: 'Phòng 203-B1', status: 'Đã hoàn thành', score: 8.8 },
        ]
    },
    {
        id: 'c-004',
        name: 'HĐ-04 (Mạng máy tính)',
        field: 'Mạng máy tính & VT',
        date: '2024-03-15',
        status: 'Cần chú ý',
        sessions_completed: 1,
        sessions_total: 4,
        criteria: MOCK_CRITERIA,
        members: [
            { id: 'm-09', name: 'PGS.TS. Trần Tấn I', role: 'Chủ tịch', department: 'MMT', email: 'tti@university.edu.vn' },
            { id: 'm-10', name: 'ThS. Lê Quang K', role: 'Thư ký', department: 'MMT', email: 'lqk@university.edu.vn' },
        ],
        sessions: [
            { id: 's-13', student_name: 'Trịnh Vĩnh Tường', mssv: 'SV20208888', thesis_title: 'Cấu hình bảo mật mạng SDN', time_start: '13:30', time_end: '14:15', room: 'Phòng 204-B1', status: 'Đã hoàn thành', score: 7.5 },
            { id: 's-14', student_name: 'Mạch Văn Khoa', mssv: 'SV20209999', thesis_title: 'Phát hiện mã độc tống tiền bằng traffic', time_start: '14:15', time_end: '15:00', room: 'Phòng 204-B1', status: 'Chờ diễn ra' }, // Missing 1 member issue
            { id: 's-15', student_name: 'Thiều Cung Trí', mssv: 'SV20200000', thesis_title: 'Tối ưu định tuyến IoT', time_start: '15:15', time_end: '16:00', room: 'Phòng 204-B1', status: 'Chờ diễn ra' },
            { id: 's-16', student_name: 'Phí Minh Tuệ', mssv: 'SV20201010', thesis_title: 'Hệ thống cảnh báo xâm nhập IDS', time_start: '16:00', time_end: '16:45', room: 'Phòng 204-B1', status: 'Chờ diễn ra' },
        ]
    }
];

export interface CouncilStats {
    total: number;
    upcoming: number;
    inProgress: number;
    completed: number;
    needsAttention: number;
}

export function calculateCouncilStats(councils: Council[]): CouncilStats {
    return {
        total: councils.length,
        upcoming: councils.filter(c => c.status === 'Chờ diễn ra').length,
        inProgress: councils.filter(c => c.status === 'Đang diễn ra').length,
        completed: councils.filter(c => c.status === 'Đã hoàn thành').length,
        needsAttention: councils.filter(c => c.status === 'Cần chú ý').length,
    };
}
