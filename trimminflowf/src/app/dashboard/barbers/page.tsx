'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { barberApi } from '@/lib/api';
import { BarberResponse } from '@/types/barber';
import { CreateBarberFormData, UpdateBarberFormData } from '@/lib/validations';
import { PageResponse } from '@/types/pagination';
import { BarberCard } from '@/components/barbers/BarberCard';
import { BarberForm } from '@/components/barbers/BarberForm';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { Plus, Loader } from 'lucide-react';

export default function BarbersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // State
  const [barbers, setBarbers] = useState<BarberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState<BarberResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load barbers
  useEffect(() => {
    if (user?.barbershopId) {
      loadBarbers();
    }
  }, [user, currentPage, searchTerm]);

  const loadBarbers = async () => {
    if (!user?.barbershopId) return;

    try {
      setIsLoading(true);
      setError('');

      const response: PageResponse<BarberResponse> = await barberApi.getPaginated(user.barbershopId, {
        page: currentPage,
        size: pageSize,
        search: searchTerm,
        activeOnly: false,
      });

      setBarbers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || t.barbers.loadError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: (CreateBarberFormData | UpdateBarberFormData) & { image?: File }) => {
    if (!user?.barbershopId) return;

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (editingBarber) {
        await barberApi.update(user.barbershopId, editingBarber.id, data);
        setSuccessMessage(t.barbers.updateSuccess);
      } else {
        await barberApi.create(user.barbershopId, data as CreateBarberFormData);
        setSuccessMessage(t.barbers.createSuccess);
      }

      setShowModal(false);
      setEditingBarber(null);
      await loadBarbers();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t.barbers.createError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (barber: BarberResponse) => {
    setEditingBarber(barber);
    setShowModal(true);
  };

  const handleDelete = async (barberId: string) => {
    if (!user?.barbershopId) return;
    if (!confirm(t.barbers.deleteConfirm)) return;

    try {
      await barberApi.delete(user.barbershopId, barberId);
      setSuccessMessage(t.barbers.deleteSuccess);
      await loadBarbers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t.barbers.deleteError);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingBarber(null);
    setError('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
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
          <h1 className="text-3xl font-bold text-white mb-2">{t.barbers.management}</h1>
          <p className="text-gray-400">
            {t.barbers.managementDescription} • {totalElements} {totalElements !== 1 ? t.barbers.totalBarbersPlural : t.barbers.totalBarbers}
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
              placeholder={t.barbers.searchPlaceholder}
            />
          </div>
          <Button onClick={() => setShowModal(true)} className="whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" />
            {t.barbers.addBarber}
          </Button>
        </div>

        {/* Barbers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              {searchTerm
                ? t.barbers.noBarbersFound
                : t.barbers.noBarbersYet}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                {t.barbers.addFirstBarber}
              </Button>
            )}
          </div>
        ) : (
          <>
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
          <BarberForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingBarber || undefined}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
