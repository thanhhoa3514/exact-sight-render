import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, UserCircle2 } from 'lucide-react';

export default function StudentMessages() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'teacher',
            name: 'PGS.TS. Lê Hoài Bắc',
            text: 'Chào em, tuần này nhóm mình có lịch họp tiến độ vào sáng thứ 5 nhé. Các em chuẩn bị slide cho kỹ.',
            time: '10:30 Hôm qua',
        },
        {
            id: 2,
            sender: 'student',
            name: 'Lê Văn Sinh',
            text: 'Dạ vâng ạ. Em sẽ tổng hợp số liệu và gửi slide draft qua email cho thầy trước thứ 4 ạ.',
            time: '11:05 Hôm qua',
        },
    ]);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleSend = () => {
        if (!currentMessage.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now(),
                sender: 'student',
                name: 'Lê Văn Sinh',
                text: currentMessage,
                time: 'Vừa xong',
            },
        ]);
        setCurrentMessage('');
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
            {/* Sidebar Contacts */}
            <Card className="w-full md:w-80 border-0 shadow-sm bg-white dark:bg-zinc-900 flex-shrink-0 h-48 md:h-full overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Liên hệ</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-l-4 border-emerald-500 cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                B
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 truncate">PGS.TS. Lê Hoài Bắc</p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">Giảng viên hướng dẫn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 border-0 shadow-sm bg-white dark:bg-zinc-900 flex flex-col h-full overflow-hidden">
                {/* Chat Header */}
                <div className="h-16 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-6 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                        B
                    </div>
                    <div>
                        <h2 className="font-medium text-zinc-900 dark:text-zinc-50">PGS.TS. Lê Hoài Bắc</h2>
                        <p className="text-xs text-emerald-500 line-clamp-1">Đang trực tuyến</p>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender === 'student';
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className="flex max-w-[80%] items-end gap-2">
                                    {!isMe && (
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-xs shrink-0 mb-5">
                                            B
                                        </div>
                                    )}
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${isMe
                                                    ? 'bg-emerald-500 text-white rounded-br-sm'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
                                                }`}
                                        >
                                            <p className="text-sm shadow-black whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                        <span className="text-[11px] text-zinc-400 mt-1.5 px-1">{msg.time}</span>
                                    </div>
                                    {isMe && <UserCircle2 className="w-6 h-6 text-zinc-300 dark:text-zinc-700 shrink-0 mb-5" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Nhập tin nhắn cho Giảng viên hướng dẫn..."
                            className="flex-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 px-8">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
