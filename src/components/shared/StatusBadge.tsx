import { cn } from '@/lib/utils';
import { type ThesisStatus, statusConfig } from '@/data/mock';

interface StatusBadgeProps {
  status: ThesisStatus;
  className?: string;
}

const variantStyles: Record<string, string> = {
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  violet: 'bg-violet/10 text-violet border-violet/20',
  success: 'bg-success/10 text-success border-success/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  muted: 'bg-muted text-muted-foreground border-border',
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[config.variant],
        className
      )}
    >
      {config.label}
    </span>
  );
}
