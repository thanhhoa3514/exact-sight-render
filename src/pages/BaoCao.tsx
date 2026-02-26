import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslation } from '@/contexts/LanguageContext';
import { statusChartData } from '@/data/mock';

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
  { hk: 'HK1 23-24', value: 98 },
  { hk: 'HK2 23-24', value: 115 },
  { hk: 'HK1 24-25', value: 128 },
  { hk: 'HK2 24-25', value: 142 },
];

const topGV = [
  { name: 'TS. Nguyễn Văn An', value: 18 },
  { name: 'PGS. Trần Thị Bình', value: 15 },
  { name: 'TS. Lê Minh Cường', value: 12 },
  { name: 'TS. Phạm Đức Dũng', value: 10 },
  { name: 'TS. Hoàng Văn Ếch', value: 8 },
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-lg)',
  fontSize: '13px',
};

export default function BaoCao() {
  const { t } = useTranslation();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <PageHeader title={t.reports.title} description={t.reports.description} />

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

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">{t.reports.trend}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="hk" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
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
