import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
    const progressSteps = [
        { title: 'Đăng ký đề tài', status: 'completed', date: '15/08/2026' },
        { title: 'Được duyệt', status: 'completed', date: '20/08/2026' },
        { title: 'Thực hiện Khoá luận', status: 'current', date: 'Đang diễn ra' },
        { title: 'Nộp quyển & Slide', status: 'pending', date: 'Dự kiến: 10/12/2026' },
        { title: 'Bảo vệ', status: 'pending', date: 'Dự kiến: 20/12/2026' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-zinc-900 dark:text-zinc-50">Tổng quan Khoá luận</h1>
                    <p className="text-zinc-500 mt-1">Học kỳ 1 - Năm học 2026-2027</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 py-1.5 px-3">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Đang thực hiện
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Progress & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Topic Info */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-lg">Đề tài của bạn</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                                    Nghiên cứu ứng dụng AI Agent trong quản lý dự án phần mềm
                                </h3>
                                <p className="text-sm text-zinc-500 mt-1">Mã đề tài: KLDL-24-001</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">Giảng viên hướng dẫn</p>
                                    <p className="font-medium">PGS.TS. Lê Hoài Bắc</p>
                                </div>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">Lĩnh vực nghiên cứu</p>
                                    <p className="font-medium">Trí tuệ nhân tạo (AI)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Timeline Tracker */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-lg">Tiến độ thực hiện</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 md:ml-4 space-y-8">
                                {progressSteps.map((step, index) => (
                                    <div key={index} className="relative pl-6 md:pl-8">
                                        {/* Status Circle */}
                                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white dark:bg-zinc-900 flex items-center justify-center
                      ${step.status === 'completed' ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-500' :
                                                step.status === 'current' ? 'border-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20' :
                                                    'border-zinc-300 dark:border-zinc-700'}`}
                                        >
                                            {step.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                            {step.status === 'current' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                        </span>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <h4 className={`font-medium text-base ${step.status === 'completed' ? 'text-zinc-900 dark:text-zinc-50' :
                                                    step.status === 'current' ? 'text-blue-600 dark:text-blue-400 font-bold' :
                                                        'text-zinc-500'
                                                }`}>
                                                {step.title}
                                            </h4>
                                            <span className="text-sm text-zinc-500 mt-1 sm:mt-0">{step.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Deadlines & Notifications */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">Thời gian còn lại</h3>
                                <Clock className="w-6 h-6 opacity-80" />
                            </div>
                            <div className="text-5xl font-bold mb-2">
                                45 <span className="text-xl font-normal opacity-80">ngày</span>
                            </div>
                            <p className="text-blue-100 text-sm">Cho đến hạn nộp báo cáo tổng kết cuối kỳ (Dự kiến 10/12/2026)</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-lg flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" /> Cần chú ý
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-lg">
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Nộp Báo cáo tiến độ Tháng 10</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-1">Hạn chót: 30/10/2026 (Còn 3 ngày)</p>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg flex items-start gap-3">
                                <div className="mt-0.5">
                                    <FileText className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Biểu mẫu nhận xét của GVHD</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">Hãy tải biểu mẫu này, điền thông tin và xin chữ ký GVHD trước khi nộp quyển.</p>
                                    <a href="#" className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 inline-block hover:underline">Tải xuống PDF</a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
