import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export default function PortalSelection() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-16 relative z-10"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 mb-6">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 font-outfit">
                    Exact Sight <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Render</span>
                </h1>
                <p className="text-lg text-zinc-500 max-w-lg mx-auto">
                    Hệ thống Quản lý Khoá luận & Hội đồng đánh giá chuyên nghiệp. Vui lòng chọn cổng đăng nhập.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
                {/* Admin/Lecturer Portal Card */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin')}
                    className="group cursor-pointer relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-none hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />

                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <ShieldCheck className="w-7 h-7" />
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Quản trị & Giảng viên</h2>
                    <p className="text-zinc-500 leading-relaxed mb-8">
                        Dành cho Cán bộ khoa, Giáo vụ và Giảng viên. Quản lý danh sách đề tài, sắp xếp hội đồng, nhập điểm và theo dõi tiến độ tổng thể.
                    </p>

                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Truy cập cổng Quản trị <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                </motion.div>

                {/* Student Portal Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/student')}
                    className="group cursor-pointer relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-none hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />

                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                        <GraduationCap className="w-7 h-7" />
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Dành cho Sinh viên</h2>
                    <p className="text-zinc-500 leading-relaxed mb-8">
                        Cổng thông tin cá nhân dành cho Sinh viên. Đăng ký luân văn, nộp báo cáo tiến độ, hỏi đáp trực tiếp với người hướng dẫn và xem điểm bảo vệ.
                    </p>

                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Truy cập cổng Sinh viên <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-zinc-400 text-sm">
                © 2026 Exact Sight. All rights reserved.
            </div>
        </div>
    );
}
