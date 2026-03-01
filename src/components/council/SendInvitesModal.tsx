import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Council } from '../../data/councilData'
import { useTranslation } from '@/contexts/LanguageContext'

interface SendInvitesModalProps {
    isOpen: boolean
    onClose: () => void
    council: Council | null
}

export function SendInvitesModal({ isOpen, onClose, council }: SendInvitesModalProps) {
    const { t } = useTranslation();
    const [recipientType, setRecipientType] = useState<'all' | 'members' | 'students'>('all')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [message, setMessage] = useState(`Kính gửi Thầy/Cô và các bạn Sinh viên,

Phòng Đào tạo xin thông báo lịch bảo vệ khóa luận tốt nghiệp của Hội đồng {COUNCIL_NAME}.
Đề nghị các thành viên hội đồng và sinh viên có mặt đúng giờ để chuẩn bị.

Chi tiết lịch trình vui lòng xem trên hệ thống. Trân trọng.`)

    const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current)
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        }
    }, [])

    if (!isOpen || !council) return null

    const handleSend = () => {
        setSending(true)

        sendTimeoutRef.current = setTimeout(() => {
            setSending(false)
            setSent(true)

            closeTimeoutRef.current = setTimeout(() => {
                setSent(false)
                onClose()
            }, 2000)
        }, 1500)
    }

    const getRecipientCount = () => {
        if (recipientType === 'all') return council.members.length + council.sessions.length
        if (recipientType === 'members') return council.members.length
        if (recipientType === 'students') return council.sessions.length
        return 0
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                        onClick={!sending ? onClose : undefined}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="send-invites-title"
                        tabIndex={-1}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && !sending) onClose()
                        }}
                        className="relative w-full max-w-2xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-muted/20 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 id="send-invites-title" className="text-xl font-bold">Gửi thông báo / Email</h2>
                                    <p className="text-sm text-muted-foreground">{council.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={sending}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {sent ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold">Đã gửi thành công!</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Thông báo đã được gửi tới {getRecipientCount()} người nhận (Email và Hệ thống).
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-foreground">Người nhận</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <button
                                                onClick={() => setRecipientType('all')}
                                                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${recipientType === 'all'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/50 bg-background hover:border-border hover:bg-muted/50'
                                                    }`}
                                            >
                                                Tất cả
                                                <span className="block text-xs text-muted-foreground font-normal mt-1">
                                                    Hội đồng & Sinh viên ({council.members.length + council.sessions.length})
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => setRecipientType('members')}
                                                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${recipientType === 'members'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/50 bg-background hover:border-border hover:bg-muted/50'
                                                    }`}
                                            >
                                                Thành viên HĐ
                                                <span className="block text-xs text-muted-foreground font-normal mt-1">
                                                    Chỉ giảng viên ({council.members.length})
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => setRecipientType('students')}
                                                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${recipientType === 'students'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/50 bg-background hover:border-border hover:bg-muted/50'
                                                    }`}
                                            >
                                                Sinh viên
                                                <span className="block text-xs text-muted-foreground font-normal mt-1">
                                                    Sinh viên bảo vệ ({council.sessions.length})
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-foreground">Tin nhắn ghi chú</label>
                                            <span className="text-xs text-muted-foreground">Biến hỗ trợ: {'{COUNCIL_NAME}'}</span>
                                        </div>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={6}
                                            className="w-full bg-background border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-muted-foreground leading-relaxed"
                                        />
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-500/90">
                                            Hệ thống sẽ tự động đính kèm chi tiết lịch bảo vệ của hội đồng <strong>{council.name}</strong> và thông tin cá nhân phù hợp với từng người nhận.
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!sent && (
                            <div className="p-6 border-t border-border/50 bg-background shrink-0 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={sending}
                                    className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    {t.detail.cancel}
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={sending}
                                    className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {sending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Gửi thông báo ({getRecipientCount()})
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
