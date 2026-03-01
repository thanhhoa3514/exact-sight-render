import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDocuments() {
    const submissions = [
        { title: 'Báo cáo tiến độ Giữa kỳ', date: '15/09/2026', file: 'BaoCao_GiuaKy_LeVanSinh.pdf', status: 'graded', points: 8.5 },
        { title: 'Slide thuyết trình nháp', date: '30/09/2026', file: 'Draft_Slide_v1.pptx', status: 'reviewed', points: null },
        { title: 'Báo cáo tiến độ Tháng 10', date: 'Chưa nộp', file: null, status: 'pending', points: null },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-zinc-900 dark:text-zinc-50">Tài liệu & Báo cáo</h1>
                    <p className="text-zinc-500 mt-1">Nộp tài liệu định kỳ và xem điểm thành phần</p>
                </div>
            </div>

            <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <FileUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Tải lên báo cáo mới</h3>
                    <p className="text-zinc-500 mb-6 max-w-md">
                        Kéo thả tệp PDF, DOCX hoặc PPTX vào đây, hoặc click vào nút bên dưới để chọn tệp. (Tối đa 50MB)
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Chọn tệp từ máy tính
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                    <CardTitle className="text-lg">Lịch sử nộp bài</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {submissions.map((sub, i) => (
                            <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg mt-0.5 ${sub.status === 'graded' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        sub.status === 'reviewed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                                        }`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">{sub.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                                            <span className="text-sm text-zinc-500 flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> {sub.date}
                                            </span>
                                            {sub.file && (
                                                <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                                    {sub.file}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:items-end gap-2 border-t sm:border-0 border-zinc-100 dark:border-zinc-800 pt-3 sm:pt-0">
                                    {sub.status === 'graded' && (
                                        <>
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã chấm</Badge>
                                            <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{sub.points} <span className="text-sm font-normal text-zinc-500">/ 10</span></span>
                                        </>
                                    )}
                                    {sub.status === 'reviewed' && (
                                        <>
                                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Đã nhận xét</Badge>
                                            <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 dark:text-blue-400">Xem góp ý</Button>
                                        </>
                                    )}
                                    {sub.status === 'pending' && (
                                        <>
                                            <Badge variant="outline" className="text-amber-500 border-amber-200 dark:border-amber-900">Chưa nộp</Badge>
                                            <Button size="sm" variant="outline" className="h-8">Nộp bài</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
