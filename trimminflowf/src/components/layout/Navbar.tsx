'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { LogOut, User, Menu, X } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  variant?: 'default' | 'outline' | 'primary';
  requiresAuth?: boolean;
  roles?: string[]; // Only show for these roles
}

export interface NavbarProps {
  links?: NavLink[];
  showLogo?: boolean;
  showAuth?: boolean; // Show login/register or user menu
}

const Navbar: React.FC<NavbarProps> = ({
  links = [],
  showLogo = true,
  showAuth = false
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinkClassName = (variant: string = 'default', isMobile: boolean = false) => {
    const baseClass = 'transition-colors';
    if (isMobile) {
      const mobileVariants = {
        default: 'text-gray-300 hover:text-yellow-400 block py-3 px-4 text-lg',
        outline: 'block py-3 px-4 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg text-center text-lg',
        primary: 'block py-3 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 rounded-lg font-medium text-center text-lg'
      };
      return `${baseClass} ${mobileVariants[variant as keyof typeof mobileVariants] || mobileVariants.default}`;
    }
    const variants = {
      default: 'text-gray-300 hover:text-yellow-400',
      outline: 'px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg',
      primary: 'px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 rounded-lg font-medium'
    };
    return `${baseClass} ${variants[variant as keyof typeof variants] || variants.default}`;
  };

  const visibleLinks = links.filter(link => {
    if (link.requiresAuth && !isAuthenticated) return false;
    if (link.roles && link.roles.length > 0 && user) {
      return link.roles.includes(user.role);
    }
    return true;
  });

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.header
        className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {showLogo && (
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/img/logo.png"
                  alt="TrimminFlow Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold font-heading text-white tracking-wider">TRIMMINFLOW</h1>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={getLinkClassName(link.variant)}
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication Section */}
            {showAuth && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4" />
                      <span className="text-sm">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-yellow-400">
                        ({user?.role})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.nav.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <Link
                      href="/login"
                      className={getLinkClassName('default')}
                    >
                      {t.nav.login}
                    </Link>
                    <Link
                      href="/register"
                      className={getLinkClassName('primary')}
                    >
                      {t.nav.register}
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="md:hidden fixed top-[57px] right-0 bottom-0 w-64 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-40 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <nav className="p-4 space-y-2">
                {visibleLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={getLinkClassName(link.variant, true)}
                  >
                    {link.label}
                  </Link>
                ))}

                {showAuth && (
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2">
                          <LanguageSelector />
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 px-4 py-3">
                          <User className="w-5 h-5" />
                          <div>
                            <div className="text-sm font-medium">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-xs text-yellow-400">
                              {user?.role}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">{t.nav.logout}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2">
                          <LanguageSelector />
                        </div>
                        <Link
                          href="/login"
                          onClick={closeMobileMenu}
                          className="block w-full px-4 py-3 text-center bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-medium"
                        >
                          {t.nav.login}
                        </Link>
                        <Link
                          href="/register"
                          onClick={closeMobileMenu}
                          className="block w-full px-4 py-3 text-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 rounded-lg font-medium"
                        >
                          {t.nav.register}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
