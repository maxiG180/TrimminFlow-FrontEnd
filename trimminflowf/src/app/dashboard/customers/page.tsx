'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { customerApi } from '@/lib/api';
import { Customer } from '@/types';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import CustomerDetailsModal from '@/components/customers/CustomerDetailsModal';
import { format } from 'date-fns';

export default function CustomersPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadCustomers = useCallback(async (pageIndex: number, search: string) => {
        if (!user?.barbershopId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await customerApi.getAll(user.barbershopId, {
                page: pageIndex,
                size: 10,
                search: search,
            });
            setCustomers(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load customers', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.barbershopId]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0); // Reset page on search
            loadCustomers(0, searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, loadCustomers]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            loadCustomers(newPage, searchTerm);
        }
    };

    const handleCustomerClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    // Helper to highlight search matches (optional, kept simple for now)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t.customers.title}</h1>
                    <p className="text-gray-400">Manage your client base</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t.customers.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="w-8 h-8 rounded-full border-b-2 border-yellow-400 animate-spin" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center p-12 text-gray-400">
                        {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 whitespace-nowrap">Name</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 whitespace-nowrap">Phone</th>
                                        <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 whitespace-nowrap">Email</th>
                                        <th className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 whitespace-nowrap">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            onClick={() => handleCustomerClick(customer)}
                                            className="group hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                        >
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                                                        {customer.firstName[0]}
                                                    </div>
                                                    <span className="text-white font-medium group-hover:text-yellow-400 transition-colors text-sm sm:text-base whitespace-nowrap">
                                                        {customer.firstName} {customer.lastName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm sm:text-base whitespace-nowrap">{customer.phone}</td>
                                            <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm sm:text-base">{customer.email || '-'}</td>
                                            <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                                                {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {
                    totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Page {page + 1} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >

            {selectedCustomer && user?.barbershopId && (
                <CustomerDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    customer={selectedCustomer}
                    barbershopId={user.barbershopId}
                />
            )}
        </div >
    );
}
