import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface AddNoteFormProps {
  date: Date
  onSave: (content: string, color: string) => void
  onCancel: () => void
}

const NOTE_COLORS = [
  { key: 'yellow', bg: 'bg-amber-300', border: 'border-amber-400' },
  { key: 'blue', bg: 'bg-blue-300', border: 'border-blue-400' },
  { key: 'green', bg: 'bg-emerald-300', border: 'border-emerald-400' },
  { key: 'red', bg: 'bg-red-300', border: 'border-red-400' },
  { key: 'gray', bg: 'bg-gray-300 dark:bg-gray-600', border: 'border-gray-400 dark:border-gray-500' },
]

export function AddNoteForm({ date, onSave, onCancel }: AddNoteFormProps) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('yellow')

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${NOTE_COLORS.find(c => c.key === color)?.bg}`} />

      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            if (content.trim()) onSave(content, color)
          }
        }}
        placeholder="Nhập ghi chú của bạn (Cmd/Ctrl + Enter để lưu)..."
        rows={3}
        className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none outline-none leading-relaxed mt-1"
      />

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => setColor(c.key)}
              title={`Màu ${c.key}`}
              className={`w-5 h-5 rounded-full ${c.bg} transition-all border ${c.border} ${color === c.key
                  ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900 scale-110 shadow-sm'
                  : 'hover:scale-110 opacity-70 hover:opacity-100'
                }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-1.5 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {t.detail.cancel}
          </button>
          <button
            onClick={() => content.trim() && onSave(content, color)}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 hover:shadow active:scale-[0.98]"
          >
            <Check className="w-3.5 h-3.5" /> Lưu
          </button>
        </div>
      </div>
    </motion.div>
  )
}
