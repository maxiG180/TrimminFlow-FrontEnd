'use client';

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
  { id: 'qr', label: 'QR Codes', icon: QrCode, href: '/dashboard/qr' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-12">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                active
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
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
