import { ReactNode } from 'react'
import { Download, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  icon: ReactNode
  title: string
  description: string
  actionIcon?: 'download' | 'arrow'
  onAction?: () => void
  isLoading?: boolean
}

export function InfoCard({
  icon,
  title,
  description,
  actionIcon = 'arrow',
  onAction,
  isLoading = false,
}: InfoCardProps) {
  const ActionIcon = actionIcon === 'download' ? Download : ArrowRight

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
        <p className="text-sm text-black/70 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onAction}
        disabled={isLoading}
        className={cn(
          'flex-shrink-0 p-2 rounded-full transition-colors',
          actionIcon === 'download'
            ? 'text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <ActionIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
