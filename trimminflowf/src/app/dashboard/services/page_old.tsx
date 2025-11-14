'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { serviceApi } from '@/lib/api';
import { Service, CreateServiceRequest } from '@/types/service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  Settings,
  LogOut,
} from 'lucide-react';

/**
 * Services Management Page
 *
 * Allows barbershop owners to:
 * - View all services
 * - Add new services
 * - Edit existing services
 * - Delete services
 */
export default function ServicesPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<CreateServiceRequest>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load services
  useEffect(() => {
    if (user?.barbershopId) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    if (!user?.barbershopId) return;

    try {
      setIsLoading(true);
      const data = await serviceApi.getAll(user.barbershopId);
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.barbershopId) return;

    setError('');
    try {
      if (editingService) {
        // Update existing service
        await serviceApi.update(user.barbershopId, editingService.id, formData);
      } else {
        // Create new service
        await serviceApi.create(user.barbershopId, formData);
      }

      // Reset form and reload services
      setFormData({ name: '', description: '', price: 0, durationMinutes: 30 });
      setShowAddModal(false);
      setEditingService(null);
      await loadServices();
    } catch (err) {
      setError('Failed to save service');
      console.error(err);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      durationMinutes: service.durationMinutes,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!user?.barbershopId) return;
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await serviceApi.delete(user.barbershopId, serviceId);
      await loadServices();
    } catch (err) {
      setError('Failed to delete service');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', price: 0, durationMinutes: 30 });
    setError('');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'services', label: 'Services', icon: Scissors },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'qr', label: 'QR Codes', icon: QrCode },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'services';
            return (
              <Link
                key={item.id}
                href={item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Services</h1>
                <p className="mt-1 text-sm text-gray-400">
                  Manage your barbershop services
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl">
            <p className="text-gray-400 mb-4">No services yet</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-yellow-400/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      service.isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {service.description && (
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-2 text-yellow-400" />
                    <span className="font-semibold">€{service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>{service.durationMinutes} minutes</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    variant="outline"
                    className="flex items-center justify-center px-3 text-red-400 hover:bg-red-500/20 border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                  Service Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Haircut"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-1">
                  Price (€) *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="15.00"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-200 mb-1">
                  Duration (minutes) *
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  required
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                  placeholder="30"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
