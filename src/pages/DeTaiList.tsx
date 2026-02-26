import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockDeTai, type ThesisStatus } from '@/data/mock';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const listVariants = { animate: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

export default function DeTaiList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockDeTai.filter((dt) => {
    const matchSearch = dt.ten.toLowerCase().includes(search.toLowerCase()) || dt.ma.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || dt.trangThai === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <PageHeader
        title="Đề tài"
        description={`${mockDeTai.length} đề tài · HK2 2024-2025`}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm đề tài
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc mã đề tài..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="cho_duyet">Chờ duyệt</SelectItem>
            <SelectItem value="da_duyet">Đã duyệt</SelectItem>
            <SelectItem value="dang_thuc_hien">Đang thực hiện</SelectItem>
            <SelectItem value="hoan_thanh">Hoàn thành</SelectItem>
            <SelectItem value="bi_tu_choi">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Mã đề tài</th>
                <th className="px-4 py-3 font-medium">Tên đề tài</th>
                <th className="px-4 py-3 font-medium">Giảng viên HD</th>
                <th className="px-4 py-3 font-medium">Lĩnh vực</th>
                <th className="px-4 py-3 font-medium">SV</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <motion.tbody variants={listVariants} initial="initial" animate="animate">
              {filtered.map((dt) => (
                <motion.tr
                  key={dt.id}
                  variants={itemVariants}
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{dt.ma}</td>
                  <td className="max-w-[300px] truncate px-4 py-3 font-medium text-foreground">{dt.ten}</td>
                  <td className="px-4 py-3 text-muted-foreground">{dt.giangVien}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{dt.linhVuc}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dt.soLuongSV}/{dt.soLuongSVMax}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={dt.trangThai} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{dt.ngayTao}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Hiển thị {filtered.length} trong {mockDeTai.length} kết quả
        </div>
      </div>
    </motion.div>
  );
}
