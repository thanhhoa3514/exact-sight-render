import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart } from 'recharts';
import { Download, FileText, Table2, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';
import { statusChartData } from '@/data/mock';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const byFieldData = [
  { name: 'AI/ML', value: 42 },
  { name: 'Web', value: 35 },
  { name: 'IoT', value: 18 },
  { name: 'Mobile', value: 22 },
  { name: 'Data Science', value: 15 },
  { name: 'Blockchain', value: 10 },
];

const trendData = [
  { hk: 'HK1 23-24', submitted: 98, approved: 92, defending: 78 },
  { hk: 'HK2 23-24', submitted: 115, approved: 108, defending: 95 },
  { hk: 'HK1 24-25', submitted: 128, approved: 120, defending: 110 },
  { hk: 'HK2 24-25', submitted: 142, approved: 135, defending: 128 },
];

const topGV = [
  { name: 'TS. Nguyễn Văn An', value: 18 },
  { name: 'PGS. Trần Thị Bình', value: 15 },
  { name: 'TS. Lê Minh Cường', value: 12 },
  { name: 'TS. Phạm Đức Dũng', value: 10 },
  { name: 'TS. Hoàng Văn Ếch', value: 8 },
];

const summaryStats = [
  { label: 'Tổng luận văn', value: '142', trend: '+12', color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10' },
  { label: 'Đã duyệt', value: '135', trend: '+8', color: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10' },
  { label: 'Đang bảo vệ', value: '128', trend: '+5', color: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10' },
  { label: 'Hoàn thành', value: '87', trend: '+3', color: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10' },
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-lg)',
  fontSize: '13px',
};

function exportToCSV() {
  const data = [
    ['Trường', 'Báo cáo luận văn', new Date().toLocaleDateString('vi-VN')],
    [''],
    ['Thống kê tổng quan'],
    ['Tổng luận văn', '142'],
    ['Đã duyệt', '135'],
    ['Đang bảo vệ', '128'],
    ['Hoàn thành', '87'],
    [''],
    ['Thống kê theo lĩnh vực'],
    ...byFieldData.map(d => [d.name, d.value]),
    [''],
    ['Giảng viên hàng đầu'],
    ...topGV.map(d => [d.name, d.value]),
  ];

  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `baocao-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function exportToPDF() {
  alert('PDF export feature will be implemented with a PDF library (pdfkit or similar)');
}

export default function BaoCao() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải báo cáo..." />;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <PageHeader title={t.reports.title} description={t.reports.description} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button size="sm" className="gap-2" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={exportToPDF}>
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-lg border border-border bg-gradient-to-br ${stat.color} p-4`}
          >
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">{stat.trend} vs kỳ trước</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.reports.status_distribution}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                {statusChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {statusChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.reports.by_field}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byFieldData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.reports.trend}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="hk" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="submitted" fill="url(#grad1)" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Area type="monotone" dataKey="approved" fill="none" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="defending" fill="none" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.reports.top_supervisors}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topGV} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
