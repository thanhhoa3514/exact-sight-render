import { motion } from 'framer-motion';
import { FileText, BookOpen, Clock, CalendarDays, CheckCircle, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import KpiCard from '@/components/shared/KpiCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockActivities, mockDeTai, statusChartData } from '@/data/mock';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const listVariants = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const activityIcons = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  info: <AlertCircle className="h-4 w-4 text-info" />,
  warning: <Clock className="h-4 w-4 text-warning" />,
};

const pendingTopics = mockDeTai.filter((dt) => dt.trangThai === 'cho_duyet');

export default function Dashboard() {
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Chào buổi sáng' : today.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const dateStr = today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {greeting}, TS. Nguyễn Văn A 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dateStr} · HK2 2024-2025
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Tổng luận văn" value={142} trend="+12 so với HK trước" trendType="up" icon={<BookOpen className="h-5 w-5" />} />
        <KpiCard title="Đang hướng dẫn" value={38} trend="+5 mới" trendType="up" icon={<FileText className="h-5 w-5" />} />
        <KpiCard title="Chờ duyệt" value={15} trend="3 quá hạn" trendType="down" icon={<Clock className="h-5 w-5" />} />
        <KpiCard title="Bảo vệ tháng này" value={12} icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      {/* Charts + Activity */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Donut Chart */}
        <div className="col-span-1 rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Trạng thái luận văn</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {statusChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1 rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-3">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Hoạt động gần đây</h3>
          <motion.div variants={listVariants} initial="initial" animate="animate" className="space-y-3">
            {mockActivities.map((act) => (
              <motion.div
                key={act.id}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                <div className="mt-0.5">{activityIcons[act.type]}</div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{act.content}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{act.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pending Topics */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Đề tài chờ duyệt</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Mã</th>
                <th className="pb-3 pr-4 font-medium">Tên đề tài</th>
                <th className="pb-3 pr-4 font-medium">Giảng viên</th>
                <th className="pb-3 pr-4 font-medium">Ngày gửi</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <motion.tbody variants={listVariants} initial="initial" animate="animate">
              {pendingTopics.map((dt) => (
                <motion.tr
                  key={dt.id}
                  variants={itemVariants}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{dt.ma}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{dt.ten}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{dt.giangVien}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{dt.ngayTao}</td>
                  <td className="py-3">
                    <StatusBadge status={dt.trangThai} />
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
