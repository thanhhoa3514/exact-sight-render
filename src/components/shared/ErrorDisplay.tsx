import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
  fullHeight?: boolean;
}

export default function ErrorDisplay({
  title,
  message,
  onRetry,
  type = 'error',
  fullHeight = false,
}: ErrorDisplayProps) {
  const iconMap = {
    error: <XCircle className="h-10 w-10 text-destructive" />,
    warning: <AlertCircle className="h-10 w-10 text-warning" />,
    info: <AlertCircle className="h-10 w-10 text-info" />,
  };

  const colorMap = {
    error: 'bg-destructive/5 border-destructive/20',
    warning: 'bg-warning/5 border-warning/20',
    info: 'bg-info/5 border-info/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border ${colorMap[type]} p-6 ${fullHeight ? 'flex h-full items-center justify-center' : ''}`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {iconMap[type]}
        <div>
          {title && (
            <h3 className="font-semibold text-foreground">
              {title}
            </h3>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        )}
      </div>
    </motion.div>
  );
}
