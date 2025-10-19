'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  variant?: 'default' | 'outline' | 'primary';
}

export interface NavbarProps {
  links?: NavLink[];
  showLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  links = [],
  showLogo = true
}) => {
  const getLinkClassName = (variant: string = 'default') => {
    const baseClass = 'transition-colors';
    const variants = {
      default: 'text-gray-300 hover:text-yellow-400',
      outline: 'px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg',
      primary: 'px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 rounded-lg font-medium'
    };
    return `${baseClass} ${variants[variant as keyof typeof variants] || variants.default}`;
  };

  return (
    <motion.header
      className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {showLogo && (
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 bg-gray-800/50 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-mono">LOGO</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-wider">TRIMMINFLOW</h1>
          </Link>
        )}

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={getLinkClassName(link.variant)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
