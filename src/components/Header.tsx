import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import logoImage from '@/assets/alumni/logo.png'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about', hasDropdown: true },
    // { label: 'Constitution', href: '/constitution' },
    { label: 'Scholarship', href: '/scholarship' },
    { label: 'News & Events', href: '/news-events' },
    { label: 'Membership', href: '/membership' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'Contact Us', href: '/contact' },
  ]

  const aboutMenuItems = [
    { label: 'About Us', href: '/about' },
    { label: 'Our History', href: '/about/history' },
    { label: 'Mission & Vision', href: '/about/mission-vision' },
    { label: 'Message from the President', href: '/about/president' },
    { label: 'Message from the Secretary General', href: '/about/secretary' },
    { label: 'Executive Members', href: '/about/executive-members' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Top Bar - Logo Gold */}
      <div className="h-7 sm:h-8 w-full flex items-center justify-end gap-2 px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-80" style={{ background: 'var(--color-gold)' }}>
        {!isAuthenticated && (
          <Link to="/register">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-0 h-5 sm:h-6 text-[10px] sm:text-xs px-2 sm:px-3 hover:bg-gray-100"
              style={{ color: 'var(--color-gold-dark)' }}
            >
              <span className="hidden sm:inline">Apply for Membership</span>
              <span className="sm:hidden">Apply</span>
            </Button>
          </Link>
        )}
        <Link to="/donate">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-100 border-0 h-5 sm:h-6 text-[10px] sm:text-xs px-2 sm:px-3"
            style={{ color: 'var(--color-gold-dark)' }}
          >
            <span className="hidden sm:inline">Make Payment/Donate</span>
            <span className="sm:hidden">Payment</span>
          </Button>
        </Link>
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard">
              <span className="text-white text-[10px] sm:text-xs font-medium hover:underline">
                Welcome, {user.name}
              </span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 border-0 h-5 sm:h-6 text-[10px] sm:text-xs px-2 sm:px-3" style={{ color: 'var(--color-gold-dark)' }}
              onClick={() => logout()}
            >
              <span className="hidden sm:inline">Log Out</span>
              <span className="sm:hidden">Logout</span>
            </Button>
          </>
        ) : (
          <Link to="/login" search={{ redirect: undefined }}>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 border-0 h-5 sm:h-6 text-[10px] sm:text-xs px-2 sm:px-3"
              style={{ color: 'var(--color-gold-dark)' }}
            >
              <span className="hidden sm:inline">Log In</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Main Navigation Bar */}
      <div className="min-h-[70px] sm:h-[90px] lg:h-[100px] bg-white shadow-lg w-full flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-80 gap-4 sm:gap-6 lg:gap-10">
        {/* Logo and School Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 no-underline">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 sm:border-3 md:border-4 bg-white flex items-center justify-center shrink-0 overflow-hidden" style={{ borderColor: 'var(--color-primary)' }}>
            <img 
              src={logoImage} 
              alt="ESAT-B Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="block" style={{ color: 'var(--color-primary)' }}>
            <h1 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
              EX-STUDENTS ASSOCIATION OF
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm">TEXTILE ENGINEERING COLLEGE, BARISHAL (ESAT-B)</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button className="font-medium hover:underline flex items-center gap-1 text-sm xl:text-base whitespace-nowrap cursor-pointer" style={{ color: 'var(--color-primary)' }}>
                      {item.label}
                      <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    {aboutMenuItems.map((menuItem) => (
                      <DropdownMenuItem
                        key={menuItem.href}
                        onClick={() => navigate({ to: menuItem.href })}
                        className="cursor-pointer"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {menuItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
            return (
              <Link
                key={item.href}
                to={item.href}
                className="font-medium hover:underline flex items-center gap-1 text-sm xl:text-base whitespace-nowrap"
                style={{ color: 'var(--color-primary)' }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
          style={{ color: 'var(--color-primary)' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200">
          <nav className="flex flex-col gap-2 sm:gap-3">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.href} className="flex flex-col">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="font-medium hover:bg-gray-50 flex items-center justify-between py-2 sm:py-2.5 px-2 rounded transition-colors w-full text-left" style={{ color: 'var(--color-primary)' }}>
                          <span className="text-sm sm:text-base">{item.label}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="start" 
                        side="bottom"
                        className="min-w-[200px] w-[calc(100vw-2rem)] max-w-[280px] ml-0"
                        sideOffset={4}
                      >
                        {aboutMenuItems.map((menuItem) => (
                          <DropdownMenuItem
                            key={menuItem.href}
                            onClick={() => {
                              navigate({ to: menuItem.href })
                              setIsMobileMenuOpen(false)
                            }}
                            className="cursor-pointer"
                        style={{ color: 'var(--color-primary)' }}
                          >
                            {menuItem.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="font-medium hover:bg-gray-50 flex items-center justify-between py-2 sm:py-2.5 px-2 rounded transition-colors"
                style={{ color: 'var(--color-primary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
