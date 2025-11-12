"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Users,
  LayoutDashboard,
  Calendar,
  Scissors,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBarberManagement } from "./hooks/useBarberManagement";
import { BarberCard } from "@/components/dashboard/BarberCard";
import { BarberFormModal } from "@/components/dashboard/BarberFormModal";

/**
 * Barbers Management Page
 *
 * Allows barbershop owners to manage their barbers (add, edit, delete)
 */
export default function BarbersPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const {
    barbers,
    isLoading,
    error,
    showAddModal,
    editingBarber,
    formData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleCloseModal,
  } = useBarberManagement(user?.barbershopId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-white font-bold">TRIMMINFLOW</h2>
            <p className="text-xs text-gray-400">Barbers</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
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
            {
              id: "barbers",
              label: "Barbers",
              icon: Users,
              href: "/dashboard/barbers",
            },
            {
              id: "customers",
              label: "Customers",
              icon: Users,
              href: "/dashboard/customers",
            },
            {
              id: "qr",
              label: "QR Codes",
              icon: QrCode,
              href: "/dashboard/qr",
            },
            {
              id: "settings",
              label: "Settings",
              icon: Settings,
              href: "/dashboard/settings",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.id === "barbers";
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Barbers</h1>
              <p className="text-gray-400">Manage your barbershop staff</p>
            </div>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Barber
            </button>
          </div>

          {/* Barbers Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading barbers...</p>
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No barbers yet</p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all font-medium"
              >
                Add Your First Barber
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barber Form Modal */}
      <BarberFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleInputChange}
        editingBarber={editingBarber}
        error={error}
      />
    </div>
  );
}
