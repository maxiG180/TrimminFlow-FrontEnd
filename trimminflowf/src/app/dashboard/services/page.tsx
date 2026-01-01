'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { serviceApi } from '@/lib/api';
import { Service } from '@/types/service';
import { CreateServiceFormData } from '@/lib/validations';
import { PageResponse } from '@/types/pagination';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceForm } from '@/components/services/ServiceForm';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { Plus, Loader } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // State
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [user, currentPage, searchTerm]);

  const loadServices = async () => {
    if (!user?.barbershopId) return;

    try {
      setIsLoading(true);
      setError('');

      const response: PageResponse<Service> = await serviceApi.getPaginated(user.barbershopId, {
        page: currentPage,
        size: pageSize,
        search: searchTerm,
        activeOnly: false,
      });

      setServices(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load services');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateServiceFormData) => {
    if (!user?.barbershopId) return;

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (editingService) {
        await serviceApi.update(user.barbershopId, editingService.id, data);
        setSuccessMessage('Service updated successfully!');
      } else {
        await serviceApi.create(user.barbershopId, data);
        setSuccessMessage('Service created successfully!');
      }

      setShowModal(false);
      setEditingService(null);
      await loadServices();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!user?.barbershopId) return;
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await serviceApi.delete(user.barbershopId, serviceId);
      setSuccessMessage('Service deleted successfully!');
      await loadServices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingService(null);
    setError('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Services Management</h1>
          <p className="text-gray-400">
            Manage your barbershop services • {totalElements} total service{totalElements !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl">
            {successMessage}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search services by name or description..."
            />
          </div>
          <Button onClick={() => setShowModal(true)} className="whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              {searchTerm
                ? 'No services found matching your search.'
                : 'No services yet. Add your first service to get started!'}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Service
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Modal */}
        {showModal && (
          <ServiceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingService || undefined}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
