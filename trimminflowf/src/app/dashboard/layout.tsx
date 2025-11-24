'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-yellow-400 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
