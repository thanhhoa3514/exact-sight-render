import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { type PersonalNote } from '../../data/calendarData'
import { useTranslation } from '@/contexts/LanguageContext';

const NOTE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  yellow: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-900 dark:text-amber-100', border: 'border-amber-200 dark:border-amber-800' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-900 dark:text-blue-100', border: 'border-blue-200 dark:border-blue-800' },
  green: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-900 dark:text-emerald-100', border: 'border-emerald-200 dark:border-emerald-800' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-900 dark:text-red-100', border: 'border-red-200 dark:border-red-800' },
  gray: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-900 dark:text-gray-100', border: 'border-gray-200 dark:border-gray-700' },
}

interface NoteCardProps {
  note: PersonalNote
  onEdit: (content: string) => void
  onDelete: () => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)
  const colors = NOTE_COLORS[note.color] || NOTE_COLORS.gray

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`border rounded-lg p-3 ${colors.border} ${colors.bg}`}
      >
        <textarea
          autoFocus
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className={`w-full bg-transparent text-sm ${colors.text} resize-none outline-none`}
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Check className="w-3 h-3" /> {t.detail.save}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            <X className="w-3 h-3" /> {t.detail.cancel}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-3 group hover:shadow-md transition-all ${colors.border} ${colors.bg}`}
    >
      <p className={`text-sm ${colors.text} whitespace-pre-wrap break-words`}>
        {note.content}
      </p>
      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <Pencil className="w-3 h-3" /> {t.detail.edit}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> {t.detail.delete}
        </button>
      </div>
    </motion.div>
  )
}
