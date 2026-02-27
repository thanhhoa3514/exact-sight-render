export interface TourStep {
  id: string
  type: 'welcome' | 'spotlight' | 'center' | 'finish'
  title: string
  subtitle?: string
  description: string
  target?: string
  position?: 'right' | 'left' | 'bottom' | 'top'
  media: string
  highlight?: string[]
  tip?: string
  cta?: string
  skip?: boolean
  secondary?: string
  shortcuts?: Array<{ keys: string[]; desc: string }>
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    type: 'welcome',          // Màn hình chào — full center modal, không spotlight
    title: 'Chào mừng đến với LVTN Manager 👋',
    subtitle: 'Hệ thống quản lý luận văn tốt nghiệp Khoa CNTT',
    description: 'Hãy để chúng tôi hướng dẫn bạn qua 5 tính năng chính trong 2 phút.',
    media: 'welcome',        // animated illustration
    cta: 'Bắt đầu tour →',
    skip: true,
  },
  {
    id: 'dashboard',
    type: 'spotlight',       // Spotlight vào vùng cụ thể
    title: 'Tổng quan — Nắm mọi thứ trong tầm tay',
    description: 'Dashboard cho bạn thấy toàn bộ trạng thái hệ thống: số luận văn, đề tài chờ duyệt, lịch bảo vệ sắp tới — tất cả trong một màn hình.',
    target: '#nav-dashboard', // CSS selector của element cần spotlight
    position: 'right',        // vị trí tooltip: right | left | bottom | top
    media: 'dashboard_preview',
    highlight: ['#kpi-cards', '#activity-feed'], // thêm các element phụ highlight
  },
  {
    id: 'de-tai',
    type: 'spotlight',
    title: 'Quản lý Đề tài — Duyệt nhanh, theo dõi dễ',
    description: 'Xem toàn bộ đề tài theo dạng card hoặc list. Click vào bất kỳ đề tài nào để xem chi tiết, duyệt hoặc từ chối — không cần chuyển trang.',
    target: '#nav-de-tai',
    position: 'right',
    media: 'topics_preview',
    tip: '💡 Nhấn vào card đề tài để mở panel chi tiết từ bên phải',
  },
  {
    id: 'luan-van',
    type: 'spotlight',
    title: 'Luận văn — Theo dõi tiến độ từng sinh viên',
    description: 'Theo dõi tiến trình mỗi luận văn từ lúc đăng ký đến khi bảo vệ. Progress bar cho bạn biết ngay ai đang đúng tiến độ, ai cần nhắc nhở.',
    target: '#nav-luan-van',
    position: 'right',
    media: 'theses_preview',
    tip: '💡 Màu đỏ trên card = sinh viên cần chú ý',
  },
  {
    id: 'sinh-vien',
    type: 'spotlight',
    title: 'Sinh viên — Directory kiểu CRM',
    description: 'Xem thông tin sinh viên như một CRM: GPA, GVHD, tiến độ luận văn — tất cả trong một card. Sinh viên có vấn đề được đánh dấu tự động.',
    target: '#nav-sinh-vien',
    position: 'right',
    media: 'students_preview',
    tip: '💡 Pipeline bar trên cùng cho thấy toàn bộ cohort theo giai đoạn',
  },
  {
    id: 'keyboard',
    type: 'center',           // Không spotlight, modal giữa màn hình
    title: 'Phím tắt — Làm việc nhanh hơn',
    description: 'LVTN Manager được tối ưu cho keyboard power users.',
    shortcuts: [
      { keys: ['⌘', 'K'],  desc: 'Mở Command Palette — tìm bất cứ thứ gì' },
      { keys: ['ESC'],      desc: 'Đóng panel / modal' },
      { keys: ['←', '→'],  desc: 'Điều hướng giữa các item trong panel' },
      { keys: ['⌘', '/'],  desc: 'Mở danh sách phím tắt' },
    ],
    media: 'shortcuts_preview',
  },
  {
    id: 'finish',
    type: 'finish',           // Màn hình kết thúc
    title: 'Bạn đã sẵn sàng! 🎉',
    description: 'Nếu cần xem lại hướng dẫn, bạn có thể mở lại bất cứ lúc nào từ menu Help.',
    cta: 'Bắt đầu sử dụng',
    secondary: 'Xem lại tour',
    media: 'finish',
  },
]
