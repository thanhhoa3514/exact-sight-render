import { motion } from 'framer-motion';
import { FileText, BookOpen, Clock, CalendarDays, CheckCircle, AlertCircle, Plus, ClipboardCheck, Calendar, Download, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/contexts/LanguageContext';
import { mockActivities, mockDeTai, statusChartData } from '@/data/mock';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { SkeletonGrid } from '@/components/shared/SkeletonLoader';

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

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function KpiCardEnhanced({ title, value, icon, children }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow duration-150 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          {icon}
        </div>
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">{count}</p>
      {children}
    </motion.div>
  );
}

const pendingTopics = mockDeTai.filter((dt) => dt.trangThai === 'cho_duyet');
const totalChart = statusChartData.reduce((s, d) => s + d.value, 0);

export default function Dashboard() {
  const { t, lang } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? t.dashboard.greeting_morning : hour < 18 ? t.dashboard.greeting_afternoon : t.dashboard.greeting_evening;
  const dateStr = today.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const pendingCount = pendingTopics.length;
  const overdueCount = 2;
  const smartSummary = pendingCount > 0
    ? t.dashboard.smart_summary_pending.replace('{pending}', String(pendingCount)).replace('{overdue}', String(overdueCount))
    : t.dashboard.smart_summary_ok;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-muted animate-pulse" />
          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        </div>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {greeting}, TS. Nguyễn Văn A 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dateStr} · HK2 2024-2025
        </p>
        <p className="mt-2 text-sm">
          {pendingCount > 0 ? (
            <>
              {smartSummary.split(String(pendingCount))[0]}
              <span className="font-semibold text-warning">{pendingCount}</span>
              {smartSummary.split(String(pendingCount))[1]?.split(String(overdueCount))[0]}
              <span className="font-semibold text-warning">{overdueCount}</span>
              {smartSummary.split(String(overdueCount)).slice(1).join(String(overdueCount))}
            </>
          ) : (
            <span className="text-success">{smartSummary}</span>
          )}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardEnhanced title={t.dashboard.total_theses} value={142} icon={<BookOpen className="h-5 w-5" />}>
          <div className="mt-2 flex items-center gap-1 text-xs text-success">
            +12 {t.dashboard.vs_last_semester}
          </div>
        </KpiCardEnhanced>
        <KpiCardEnhanced title={t.dashboard.supervising} value={38} icon={<FileText className="h-5 w-5" />}>
          <p className="mt-1 text-xs text-muted-foreground">38 / 40</p>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
            <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 0.6, delay: 0.3 }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">95% {t.dashboard.capacity}</p>
        </KpiCardEnhanced>
        <KpiCardEnhanced title={t.dashboard.pending_approval} value={15} icon={<Clock className="h-5 w-5" />}>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
            <span className="text-destructive">3 {t.dashboard.overdue}</span>
          </div>
          <button className="mt-1 text-xs font-medium text-foreground hover:underline">{t.dashboard.view_now}</button>
        </KpiCardEnhanced>
        <KpiCardEnhanced title={t.dashboard.defending_this_month} value={12} icon={<CalendarDays className="h-5 w-5" />}>
          <p className="mt-2 text-xs text-muted-foreground">{t.dashboard.nearest}: 02/03</p>
          <button className="mt-1 text-xs font-medium text-foreground hover:underline">{t.dashboard.view_schedule}</button>
        </KpiCardEnhanced>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" />{t.dashboard.quick_add_topic}</Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ClipboardCheck className="h-3.5 w-3.5" />
          {t.dashboard.quick_approve} ({pendingCount})
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-warning" />
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Calendar className="h-3.5 w-3.5" />{t.dashboard.quick_schedule}</Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" />{t.dashboard.quick_export}</Button>
      </div>

      {/* Charts + Activity */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Donut Chart */}
        <div className="col-span-1 rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.dashboard.thesis_status}</h3>
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
                <Label
                  content={() => (
                    <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-display text-2xl font-bold">
                      {totalChart}
                    </text>
                  )}
                />
                <Label
                  content={() => (
                    <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                      {t.dashboard.total_label}
                    </text>
                  )}
                />
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
                {item.name} <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1 rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-3">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.dashboard.recent_activity}</h3>
          <div className="space-y-1">
            <p className="sticky top-0 bg-card py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.dashboard.today}</p>
            <motion.div variants={listVariants} initial="initial" animate="animate" className="space-y-1">
              {mockActivities.slice(0, 4).map((act) => (
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
            <p className="sticky top-0 bg-card py-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.dashboard.yesterday}</p>
            <motion.div variants={listVariants} initial="initial" animate="animate" className="space-y-1">
              {mockActivities.slice(4).map((act) => (
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
      </div>

      {/* Pending Topics */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.dashboard.pending_topics}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Mã</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tên đề tài</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Giảng viên</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Ngày gửi</th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Trạng thái</th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <motion.tbody variants={listVariants} initial="initial" animate="animate">
              {pendingTopics.map((dt) => (
                <motion.tr
                  key={dt.id}
                  variants={itemVariants}
                  className="group cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{dt.ma}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{dt.ten}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{dt.giangVien}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{dt.ngayTao}</td>
                  <td className="py-3">
                    <StatusBadge status={dt.trangThai} />
                  </td>
                  <td className="py-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
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
