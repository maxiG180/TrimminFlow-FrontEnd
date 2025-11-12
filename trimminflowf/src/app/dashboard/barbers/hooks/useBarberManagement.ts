import { useState, useEffect, useCallback } from 'react';
import { Barber, CreateBarberRequest } from '@/types/barber';
import { barberApi } from '@/lib/api';

export function useBarberManagement(barbershopId: string | undefined) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState<CreateBarberRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadBarbers = useCallback(async () => {
    if (!barbershopId) return;

    try {
      setIsLoading(true);
      const response = await barberApi.getAll(barbershopId, { page, size: pageSize });
      setBarbers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Failed to load barbers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [barbershopId, page, pageSize]);

  useEffect(() => {
    loadBarbers();
  }, [loadBarbers]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershopId) return;

    setError('');
    try {
      if (editingBarber) {
        await barberApi.update(barbershopId, editingBarber.id, formData);
      } else {
        await barberApi.create(barbershopId, formData);
      }

      // Reset form and reload barbers
      setFormData({ firstName: '', lastName: '', email: '', phone: '', bio: '' });
      setShowAddModal(false);
      setEditingBarber(null);
      await loadBarbers();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to save barber';
      setError(errorMessage);
      console.error(err);
    }
  }, [barbershopId, editingBarber, formData, loadBarbers]);

  const handleEdit = useCallback((barber: Barber) => {
    setEditingBarber(barber);
    setFormData({
      firstName: barber.firstName,
      lastName: barber.lastName,
      email: barber.email || '',
      phone: barber.phone || '',
      bio: barber.bio || '',
    });
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback(async (barberId: string) => {
    if (!barbershopId) return;
    if (!confirm('Are you sure you want to delete this barber?')) return;

    try {
      await barberApi.delete(barbershopId, barberId);
      await loadBarbers();
    } catch (err) {
      setError('Failed to delete barber');
      console.error(err);
    }
  }, [barbershopId, loadBarbers]);

  const handleAddNew = useCallback(() => {
    setEditingBarber(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', bio: '' });
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingBarber(null);
    setError('');
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(0); // Reset to first page when changing page size
  }, []);

  return {
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
    // Pagination
    page,
    pageSize,
    totalPages,
    totalElements,
    handlePageChange,
    handlePageSizeChange,
  };
}
