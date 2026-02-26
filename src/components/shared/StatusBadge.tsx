import { cn } from '@/lib/utils';
import { type ThesisStatus, statusConfig } from '@/data/mock';

interface StatusBadgeProps {
  status: ThesisStatus;
  className?: string;
}

const variantStyles: Record<string, { dot: string; badge: string }> = {
  warning: { dot: 'bg-warning', badge: 'bg-warning/10 text-warning border-warning/20' },
  info: { dot: 'bg-info', badge: 'bg-info/10 text-info border-info/20' },
  violet: { dot: 'bg-violet', badge: 'bg-violet/10 text-violet border-violet/20' },
  success: { dot: 'bg-success', badge: 'bg-success/10 text-success border-success/20' },
  destructive: { dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive border-destructive/20' },
  muted: { dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground border-border' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const style = variantStyles[config.variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        style.badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {config.label}
    </span>
  );
}
