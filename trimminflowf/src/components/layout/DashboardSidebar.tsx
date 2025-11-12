"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
  },
  {
    id: "services",
    label: "Services",
    icon: Scissors,
    href: "/dashboard/services",
  },
  { id: "barbers", label: "Barbers", icon: Users, href: "/dashboard/barbers" },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: "/dashboard/customers",
  },
  { id: "qr", label: "QR Codes", icon: QrCode, href: "/dashboard/qr" },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
          <Scissors className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-white font-bold">TRIMMINFLOW</h2>
          <p className="text-xs text-gray-400">Dashboard</p>
        </div>
      </div>

      <nav className="space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
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
