import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FileText,
    GraduationCap,
    Users,
    UserCheck,
    Scale,
    LayoutDashboard,
} from 'lucide-react'
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from '@/components/ui/command'
import {
    searchIndex,
    searchTypeLabels,
    type SearchItemType,
} from '@/data/searchIndex'

// Icon per search type
const typeIcons: Record<SearchItemType, React.ElementType> = {
    page: LayoutDashboard,
    de_tai: FileText,
    luan_van: GraduationCap,
    sinh_vien: Users,
    giang_vien: UserCheck,
    hoi_dong: Scale,
}

interface CommandPaletteProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const navigate = useNavigate()

    // Support both controlled and uncontrolled usage
    const isOpen = controlledOpen ?? internalOpen
    const setOpen = onOpenChange ?? setInternalOpen

    // ⌘K / Ctrl+K global shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(!isOpen)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, setOpen])

    const handleSelect = useCallback(
        (href: string) => {
            setOpen(false)
            navigate(href)
        },
        [navigate, setOpen]
    )

    // Group items by type
    const grouped = searchIndex.reduce(
        (acc, item) => {
            if (!acc[item.type]) acc[item.type] = []
            acc[item.type].push(item)
            return acc
        },
        {} as Record<string, typeof searchIndex>
    )

    // Render order: pages first, then entities
    const groupOrder: SearchItemType[] = [
        'page',
        'de_tai',
        'luan_van',
        'sinh_vien',
        'giang_vien',
        'hoi_dong',
    ]

    return (
        <CommandDialog open={isOpen} onOpenChange={setOpen}>
            <CommandInput placeholder="Tìm kiếm đề tài, luận văn, sinh viên..." />
            <CommandList>
                <CommandEmpty>
                    <div className="flex flex-col items-center gap-2 py-4">
                        <span className="text-sm text-muted-foreground">
                            Không tìm thấy kết quả
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                            Thử từ khóa khác hoặc duyệt theo trang
                        </span>
                    </div>
                </CommandEmpty>

                {groupOrder.map((type, i) => {
                    const items = grouped[type]
                    if (!items?.length) return null

                    const Icon = typeIcons[type]

                    return (
                        <div key={type}>
                            {i > 0 && <CommandSeparator />}
                            <CommandGroup
                                heading={
                                    <span className="flex items-center gap-1.5">
                                        <Icon className="w-3.5 h-3.5 opacity-60" />
                                        {searchTypeLabels[type]}
                                    </span>
                                }
                            >
                                {items.map((item) => {
                                    const ItemIcon = typeIcons[item.type]
                                    return (
                                        <CommandItem
                                            key={item.id}
                                            value={[item.title, item.subtitle, ...item.keywords].join(' ')}
                                            onSelect={() => handleSelect(item.href)}
                                            className="flex items-center gap-3 py-2.5"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                                                <ItemIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                            <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 bg-secondary px-1.5 py-0.5 rounded">
                                                {searchTypeLabels[item.type]}
                                            </span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </div>
                    )
                })}
            </CommandList>
        </CommandDialog>
    )
}
