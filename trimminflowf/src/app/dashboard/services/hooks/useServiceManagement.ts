import { useState, useEffect, useCallback } from 'react';
import { Service, CreateServiceRequest } from '@/types/service';
import { serviceApi } from '@/lib/api';

export function useServiceManagement(barbershopId: string | undefined) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<CreateServiceRequest>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    isActive: true,
  });

  const loadServices = useCallback(async () => {
    console.log("useServiceManagement: barbershopId from context:", barbershopId);
    if (!barbershopId || typeof barbershopId !== 'string' || barbershopId.length !== 36) {
      setError('Invalid barbershopId (must be a UUID)');
      console.error('Invalid barbershopId:', barbershopId);
      setServices([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const allServices = await serviceApi.getAllNonPaginated(barbershopId);
      const mappedServices = allServices.map((s: any) => ({
        id: s.id,
        barbershopId: s.barbershopId,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMinutes: s.durationMinutes,
        isActive: s.isActive,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));
      setServices(mappedServices);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [barbershopId]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox') {
      checked = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'durationMinutes'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? checked
          : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershopId) return;

    setError('');
    try {
      if (editingService) {
        await serviceApi.update(barbershopId, editingService.id, formData);
      } else {
        const created = await serviceApi.create(barbershopId, { ...formData, isActive: true });
        console.log('Service created:', created);
      }

      setFormData({ name: '', description: '', price: 0, durationMinutes: 30, isActive: true });
      setShowAddModal(false);
      setEditingService(null);
      await loadServices();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to save service';
      setError(errorMessage);
      console.error(err);
    }
  }, [barbershopId, editingService, formData, loadServices]);

  const handleEdit = useCallback((service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive,
    });
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback(async (serviceId: string) => {
    if (!barbershopId) return;
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await serviceApi.delete(barbershopId, serviceId);
      await loadServices();
    } catch (err) {
      setError('Failed to delete service');
      console.error(err);
    }
  }, [barbershopId, loadServices]);

  const handleAddNew = useCallback(() => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: 0, durationMinutes: 30, isActive: true });
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingService(null);
    setError('');
    setFormData({ name: '', description: '', price: 0, durationMinutes: 30, isActive: true });
  }, []);

  return {
    services,
    isLoading,
    error,
    showAddModal,
    editingService,
    formData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleCloseModal,
  };
}
