'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  Settings,
  LogOut,
  Home,
  Scissors,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon?: typeof LayoutDashboard;
  iconSvg?: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { id: 'services', label: 'Services', icon: Scissors, href: '/dashboard/services' },
  { id: 'barbers', label: 'Barbers', icon: Users, href: '/dashboard/barbers' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/dashboard/customers' },
  {
    id: 'analytics',
    label: 'Analytics',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>`,
    href: '/dashboard/analytics'
  },
  { id: 'qr', label: 'QR Codes', icon: QrCode, href: '/dashboard/qr' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image
              src="/img/logo.png"
              alt="TrimminFlow Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">TRIMMINFLOW</h2>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 lg:top-0 left-0 h-screen z-40
          w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 pt-16 lg:pt-6 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-3 mb-12">
          <div className="w-10 h-10 relative">
            <Image
              src="/img/logo.png"
              alt="TrimminFlow Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold">TRIMMINFLOW</h2>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {item.iconSvg ? (
                  <div className={`w-5 h-5 ${active ? 'brightness-0' : 'brightness-100 group-hover:brightness-125'}`}>
                    <Image
                      src={item.iconSvg}
                      alt={item.label}
                      width={20}
                      height={20}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : Icon ? (
                  <Icon className="w-5 h-5" />
                ) : null}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 mt-auto">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <button
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
