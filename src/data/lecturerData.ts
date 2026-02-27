export interface AssignedStudent {
    id: string;
    name: string;
    mssv: string;
    thesis_title: string;
    thesis_linh_vuc: string[];
    progress_week: number;
}

export interface CouncilConflict {
    hd1: string;
    hd2: string;
    time: string;
}

export interface CouncilRole {
    ten_hoi_dong: string;
    vai_tro: 'chu_tich' | 'phan_bien' | 'uy_vien' | 'thu_ky';
    ngay_bao_ve: string; // ISO String
    phong: string;
    so_luan_van: number;
}

export interface Lecturer {
    id: string;
    name: string;
    ma_gv: string;
    hoc_vi: string | null;
    hoc_ham: string | null;
    bo_mon: string;
    expertise: string[];
    email: string;
    phone?: string;

    // Workload capacity
    sv_hien_tai: number;
    sv_toi_da: number;

    // Council involvement
    hoi_dong_count: number;
    phan_bien_count: number;
    chu_tich_count: number;
    uy_vien_count: number;

    // Hours
    gio_nghia_vu: number;
    gio_nghia_vu_dinh_muc: number;

    // Relations
    councils: CouncilRole[];
    students: AssignedStudent[];
}

export interface LecturerStats {
    total: number;
    bo_mon_count: number;
    dang_huong_dan: number;
    tong_sv_duoc_hd: number;
    sap_day: number;
    con_trong: number;
    qua_tai: number;
}

export const DEPARTMENTS = [
    'Khoa học Máy tính',
    'Kỹ thuật Phần mềm',
    'Mạng máy tính & TT',
    'Hệ thống Thông tin',
    'Kỹ thuật Máy tính'
];

export const EXPERTISE_TAGS = [
    'AI/ML', 'Web', 'Mobile', 'IoT', 'Blockchain',
    'Data Science', 'Security', 'Cloud', 'Computer Vision', 'NLP', 'Embedded'
];

// Helper to calculate workload hours based on current assignments
const calculateWorkload = (l: Partial<Lecturer>): number => {
    const HD_HOURS = 5;
    const PB_HOURS = 2;
    const CT_HOURS = 4;
    const UV_HOURS = 1;

    return (l.sv_hien_tai || 0) * HD_HOURS +
        (l.phan_bien_count || 0) * PB_HOURS +
        (l.chu_tich_count || 0) * CT_HOURS +
        (l.uy_vien_count || 0) * UV_HOURS;
}

export const mockLecturers: Lecturer[] = [
    {
        id: 'gv001',
        name: 'Nguyễn Văn An',
        ma_gv: 'GV001',
        hoc_vi: 'TS',
        hoc_ham: null,
        bo_mon: 'Khoa học Máy tính',
        expertise: ['AI/ML', 'Deep Learning', 'Computer Vision'],
        email: 'an.nv@university.edu.vn',
        phone: '0901 234 567',
        sv_hien_tai: 4,
        sv_toi_da: 5,
        hoi_dong_count: 3,
        phan_bien_count: 2,
        chu_tich_count: 1,
        uy_vien_count: 0,
        gio_nghia_vu: 28, // 4*5 + 2*2 + 1*4 = 28
        gio_nghia_vu_dinh_muc: 30,
        councils: [
            {
                ten_hoi_dong: 'HĐ-01',
                vai_tro: 'chu_tich',
                ngay_bao_ve: '2024-03-15T08:00:00Z',
                phong: 'P.A101',
                so_luan_van: 4
            },
            {
                ten_hoi_dong: 'HĐ-03',
                vai_tro: 'phan_bien',
                ngay_bao_ve: '2024-03-15T13:00:00Z', // Note: Same day but afternoon, might be flagged as conflict if we adjust logic
                phong: 'P.B201',
                so_luan_van: 3
            }
        ],
        students: [
            { id: 'sv1', name: 'Trần Văn Bảo', mssv: '20110001', thesis_title: 'ML trong phát hiện gian lận', thesis_linh_vuc: ['AI/ML'], progress_week: 6 },
            { id: 'sv2', name: 'Lê Thị Cẩm', mssv: '20110002', thesis_title: 'Nhận diện khuôn mặt', thesis_linh_vuc: ['Computer Vision'], progress_week: 4 },
            { id: 'sv3', name: 'Phạm Văn Dũng', mssv: '20110003', thesis_title: 'Phân tích cảm xúc MXH', thesis_linh_vuc: ['NLP'], progress_week: 8 },
            { id: 'sv4', name: 'Hoàng Thị E', mssv: '20110004', thesis_title: 'Dự đoán giá cổ phiếu', thesis_linh_vuc: ['Data Science'], progress_week: 2 },
        ]
    },
    {
        id: 'gv002',
        name: 'Trần Thị Bình',
        ma_gv: 'GV002',
        hoc_vi: 'TS',
        hoc_ham: 'PGS',
        bo_mon: 'Kỹ thuật Phần mềm',
        expertise: ['IoT', 'Web', 'Security'],
        email: 'binh.tt@university.edu.vn',
        sv_hien_tai: 3,
        sv_toi_da: 5,
        hoi_dong_count: 1,
        phan_bien_count: 0,
        chu_tich_count: 1,
        uy_vien_count: 0,
        gio_nghia_vu: 19, // 3*5 + 1*4 = 19
        gio_nghia_vu_dinh_muc: 30,
        councils: [
            {
                ten_hoi_dong: 'HĐ-02',
                vai_tro: 'chu_tich',
                ngay_bao_ve: '2024-03-16T08:00:00Z',
                phong: 'P.A102',
                so_luan_van: 5
            }
        ],
        students: [
            { id: 'sv5', name: 'Ngô Văn Khá', mssv: '20110005', thesis_title: 'Hệ thống nhà thông minh', thesis_linh_vuc: ['IoT'], progress_week: 5 },
            { id: 'sv6', name: 'Đinh Thị L', mssv: '20110006', thesis_title: 'Mạng lưới cảm biến nông nghiệp', thesis_linh_vuc: ['IoT'], progress_week: 3 },
            { id: 'sv7', name: 'Trương Văn M', mssv: '20110007', thesis_title: 'Bảo mật ứng dụng Web', thesis_linh_vuc: ['Security', 'Web'], progress_week: 7 },
        ]
    },
    // Overloaded
    {
        id: 'gv003',
        name: 'Lê Hoàng Nam',
        ma_gv: 'GV003',
        hoc_vi: 'ThS',
        hoc_ham: null,
        bo_mon: 'Mạng máy tính & TT',
        expertise: ['Cloud', 'Security', 'Blockchain'],
        email: 'nam.lh@university.edu.vn',
        sv_hien_tai: 6,
        sv_toi_da: 5,
        hoi_dong_count: 2,
        phan_bien_count: 1,
        chu_tich_count: 0,
        uy_vien_count: 1,
        gio_nghia_vu: 33, // 6*5 + 1*2 + 1*1 = 33
        gio_nghia_vu_dinh_muc: 30,
        councils: [],
        students: [] // Omitted detailed students for brevity
    },
    // Empty
    {
        id: 'gv004',
        name: 'Phạm Quang Minh',
        ma_gv: 'GV004',
        hoc_vi: 'TS',
        hoc_ham: null,
        bo_mon: 'Hệ thống Thông tin',
        expertise: ['Data Science', 'Business Intelligence'],
        email: 'minh.pq@university.edu.vn',
        sv_hien_tai: 0,
        sv_toi_da: 4,
        hoi_dong_count: 0,
        phan_bien_count: 0,
        chu_tich_count: 0,
        uy_vien_count: 0,
        gio_nghia_vu: 0,
        gio_nghia_vu_dinh_muc: 20,
        councils: [],
        students: []
    },
    // Near full
    {
        id: 'gv005',
        name: 'Hoàng Kim Yến',
        ma_gv: 'GV005',
        hoc_vi: 'TS',
        hoc_ham: null,
        bo_mon: 'Khoa học Máy tính',
        expertise: ['NLP', 'AI/ML'],
        email: 'yen.hk@university.edu.vn',
        sv_hien_tai: 4,
        sv_toi_da: 5,
        hoi_dong_count: 2,
        phan_bien_count: 2,
        chu_tich_count: 0,
        uy_vien_count: 0,
        gio_nghia_vu: 24, // 4*5 + 2*2 = 24
        gio_nghia_vu_dinh_muc: 30,
        councils: [],
        students: []
    },
    // Just some normal load
    {
        id: 'gv006',
        name: 'Đoàn Hữu Trí',
        ma_gv: 'GV006',
        hoc_vi: 'ThS',
        hoc_ham: null,
        bo_mon: 'Kỹ thuật Máy tính',
        expertise: ['Embedded', 'IoT'],
        email: 'tri.dh@university.edu.vn',
        sv_hien_tai: 2,
        sv_toi_da: 5,
        hoi_dong_count: 1,
        phan_bien_count: 0,
        chu_tich_count: 0,
        uy_vien_count: 1,
        gio_nghia_vu: 11, // 2*5 + 1*1 = 11
        gio_nghia_vu_dinh_muc: 30,
        councils: [],
        students: []
    }
];

// Helper to auto-calculate derived stats for the mockup pool
export const calculateGlobalStats = (lecturers: Lecturer[]): LecturerStats => {
    const departments = new Set(lecturers.map(l => l.bo_mon));
    let dang_huong_dan = 0;
    let tong_sv_duoc_hd = 0;
    let sap_day = 0;
    let con_trong = 0;
    let qua_tai = 0;

    lecturers.forEach(l => {
        const pct = l.sv_hien_tai / l.sv_toi_da;
        if (l.sv_hien_tai > 0) dang_huong_dan++;
        tong_sv_duoc_hd += l.sv_hien_tai;

        if (pct > 1) {
            qua_tai++;
        } else if (pct >= 0.8) {
            sap_day++;
        } else if (pct < 0.8) {
            con_trong++; // Simple definition of 'có slot'
        }
    });

    return {
        total: lecturers.length,
        bo_mon_count: departments.size,
        dang_huong_dan,
        tong_sv_duoc_hd,
        sap_day,
        con_trong,
        qua_tai
    };
};

export const unassignedStudents = [
    { id: 'sv_u1', name: 'Đào Duy Nam', mssv: '20111111', thesis_title: 'Phát hiện ung thư từ ảnh X-quang', thesis_linh_vuc: ['AI/ML', 'Computer Vision'], progress_week: 0 },
    { id: 'sv_u2', name: 'Vũ Ngọc Hoa', mssv: '20111112', thesis_title: 'Xây dựng Blockchain cho chuỗi cung ứng', thesis_linh_vuc: ['Blockchain', 'Web'], progress_week: 0 },
    { id: 'sv_u3', name: 'Nguyễn Tiến Dũng', mssv: '20111113', thesis_title: 'Hệ thống tưới tự động', thesis_linh_vuc: ['IoT', 'Embedded'], progress_week: 0 },
];
