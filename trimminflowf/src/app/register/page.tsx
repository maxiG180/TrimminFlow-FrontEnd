'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import BarbershopRegistrationForm from '@/components/BarbershopRegistrationForm';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
  const navLinks = [
    { href: '/', label: 'Back to Home', variant: 'default' as const },
    { href: '/login', label: 'Login', variant: 'default' as const },
    { href: '/dashboard', label: 'Dashboard', variant: 'outline' as const, requiresAuth: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar links={navLinks} showAuth={true} />

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight">
              Register Your
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block font-heading">
                Barbershop
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of barbershops modernizing their business. Get started in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BarbershopRegistrationForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
