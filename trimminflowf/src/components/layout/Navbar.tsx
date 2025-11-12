"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { LogOut, User, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  variant?: "default" | "outline" | "primary";
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
  showAuth = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const getLinkClassName = (variant: string = "default") => {
    const baseClass = "transition-colors";
    const variants = {
      default: "text-gray-300 hover:text-yellow-400",
      outline:
        "px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg",
      primary:
        "px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 rounded-lg font-medium",
    };
    return `${baseClass} ${
      variants[variant as keyof typeof variants] || variants.default
    }`;
  };

  // Filter links based on authentication and roles
  const visibleLinks = links.filter((link) => {
    // If link requires auth and user is not authenticated, hide it
    if (link.requiresAuth && !isAuthenticated) return false;

    // If link has role requirements, check if user has the role
    if (link.roles && link.roles.length > 0 && user) {
      return link.roles.includes(user.role);
    }

    return true;
  });

  return (
    <motion.header
      className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {showLogo && (
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 bg-gray-800/50 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-mono">LOGO</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-wider">
              TRIMMINFLOW
            </h1>
          </Link>
        )}

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
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-yellow-400">
                      ({user?.role})
                    </span>
                  </div>
                  {user?.role === "admin" && (
                    <Link
                      href="/dashboard/barbers"
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Manage Barbers"
                    >
                      <Settings className="w-4 h-4 text-yellow-400" />
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className={getLinkClassName("default")}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={getLinkClassName("primary")}
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
