import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">LVTN Manager</h1>
            <p className="mt-1 text-sm text-muted-foreground">Hệ thống Quản lý Luận Văn Tốt Nghiệp</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="email@university.edu.vn" className="pl-9" defaultValue="admin@hcmut.edu.vn" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="pl-9" defaultValue="password" />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Khoa Công nghệ Thông tin · Đại học Bách Khoa
          </p>
        </div>
      </motion.div>
    </div>
  );
}
