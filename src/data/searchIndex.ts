import { mockDeTai, mockLuanVan, mockSinhVien, statusConfig } from './mock'
import { mockLecturers } from './lecturerData'
import { mockCouncils } from './councilData'

export type SearchItemType = 'de_tai' | 'luan_van' | 'sinh_vien' | 'giang_vien' | 'hoi_dong' | 'page'

export interface SearchItem {
    id: string
    type: SearchItemType
    title: string
    subtitle: string
    href: string
    keywords: string[]
}

// Labels per type — used for group headings and badges
export const searchTypeLabels: Record<SearchItemType, string> = {
    page: 'Trang',
    de_tai: 'Đề tài',
    luan_van: 'Luận văn',
    sinh_vien: 'Sinh viên',
    giang_vien: 'Giảng viên',
    hoi_dong: 'Hội đồng',
}

// Quick-access pages
const pageItems: SearchItem[] = [
    { id: 'p-dashboard', type: 'page', title: 'Tổng quan', subtitle: 'Dashboard chính', href: '/', keywords: ['tong quan', 'dashboard', 'home'] },
    { id: 'p-detai', type: 'page', title: 'Đề tài', subtitle: 'Quản lý đề tài luận văn', href: '/de-tai', keywords: ['de tai', 'topic'] },
    { id: 'p-luanvan', type: 'page', title: 'Luận văn', subtitle: 'Danh sách luận văn', href: '/luan-van', keywords: ['luan van', 'thesis'] },
    { id: 'p-sinhvien', type: 'page', title: 'Sinh viên', subtitle: 'Quản lý sinh viên', href: '/sinh-vien', keywords: ['sinh vien', 'student'] },
    { id: 'p-giangvien', type: 'page', title: 'Giảng viên', subtitle: 'Quản lý giảng viên', href: '/giang-vien', keywords: ['giang vien', 'lecturer'] },
    { id: 'p-hoidong', type: 'page', title: 'Hội đồng', subtitle: 'Quản lý hội đồng bảo vệ', href: '/hoi-dong', keywords: ['hoi dong', 'council', 'defense'] },
    { id: 'p-lichbaove', type: 'page', title: 'Lịch bảo vệ', subtitle: 'Lịch và calendar sự kiện', href: '/lich-bao-ve', keywords: ['lich', 'calendar', 'bao ve'] },
    { id: 'p-baocao', type: 'page', title: 'Báo cáo', subtitle: 'Thống kê và báo cáo', href: '/bao-cao', keywords: ['bao cao', 'report', 'thong ke'] },
]

function buildSearchIndex(): SearchItem[] {
    const items: SearchItem[] = [...pageItems]

    // Đề tài
    for (const dt of mockDeTai) {
        items.push({
            id: `dt-${dt.id}`,
            type: 'de_tai',
            title: dt.ten,
            subtitle: `${dt.ma} · ${dt.giangVien} · ${statusConfig[dt.trangThai].label}`,
            href: '/de-tai',
            keywords: [dt.ma, dt.giangVien, dt.linhVuc, dt.ten],
        })
    }

    // Luận văn
    for (const lv of mockLuanVan) {
        items.push({
            id: `lv-${lv.id}`,
            type: 'luan_van',
            title: lv.ten,
            subtitle: `${lv.ma} · ${lv.sinhVien} (${lv.mssv}) · ${lv.giangVienHD}`,
            href: '/luan-van',
            keywords: [lv.ma, lv.sinhVien, lv.mssv, lv.giangVienHD, lv.ten],
        })
    }

    // Sinh viên
    for (const sv of mockSinhVien) {
        items.push({
            id: `sv-${sv.id}`,
            type: 'sinh_vien',
            title: sv.name,
            subtitle: `${sv.mssv} · ${sv.chuyen_nganh} · GPA ${sv.gpa}`,
            href: '/sinh-vien',
            keywords: [sv.mssv, sv.chuyen_nganh, sv.lop, sv.email, sv.name],
        })
    }

    // Giảng viên
    for (const gv of mockLecturers) {
        const prefix = [gv.hoc_ham, gv.hoc_vi].filter(Boolean).join('. ')
        items.push({
            id: `gv-${gv.id}`,
            type: 'giang_vien',
            title: prefix ? `${prefix}. ${gv.name}` : gv.name,
            subtitle: `${gv.ma_gv} · ${gv.bo_mon} · ${gv.sv_hien_tai}/${gv.sv_toi_da} SV`,
            href: '/giang-vien',
            keywords: [gv.ma_gv, gv.bo_mon, gv.email, ...gv.expertise, gv.name],
        })
    }

    // Hội đồng
    for (const hd of mockCouncils) {
        items.push({
            id: `hd-${hd.id}`,
            type: 'hoi_dong',
            title: hd.name,
            subtitle: `${hd.field} · ${hd.date} · ${hd.status}`,
            href: '/hoi-dong',
            keywords: [hd.field, hd.name, ...hd.members.map(m => m.name)],
        })
    }

    return items
}

// Singleton — build once
export const searchIndex = buildSearchIndex()
