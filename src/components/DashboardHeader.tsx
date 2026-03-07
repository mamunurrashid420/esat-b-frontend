import { Calendar, Bell, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const formatDate = (date: Date): string => {
    const day = date.getDate()
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th'
    const month = date.toLocaleDateString('en-GB', { month: 'long' })
    const year = date.getFullYear()
    return `${day}${suffix} ${month}, ${year}`
  }

  const currentDate = formatDate(new Date())

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Title */}
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-black">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-black/70 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right: Date, Profile, Notifications */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Date */}
          <div className="flex items-center gap-1.5 md:gap-2 text-black">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">{currentDate}</span>
            <span className="text-xs md:text-sm font-medium sm:hidden">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
          </div>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 md:gap-2 text-black hover:text-[var(--color-primary)] transition-colors"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">Profile</span>
          </Link>

          {/* Notifications */}
          <button className="relative text-black hover:text-[var(--color-primary)] transition-colors p-1">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
