import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { 
  Scissors, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  QrCode, 
  Settings,
  Bell,
  User,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";

interface ModernSidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function ModernSidebar({ activeScreen, onScreenChange }: ModernSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      gradient: "from-yellow-500 to-amber-600",
      notification: false
    },
    { 
      id: "calendar", 
      label: "Calendar", 
      icon: Calendar,
      gradient: "from-amber-500 to-yellow-600",
      notification: true
    },
    { 
      id: "customers", 
      label: "Customers", 
      icon: Users,
      gradient: "from-yellow-600 to-amber-700",
      notification: false
    },
    { 
      id: "qr", 
      label: "QR Codes", 
      icon: QrCode,
      gradient: "from-amber-600 to-yellow-700",
      notification: false
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings,
      gradient: "from-yellow-700 to-amber-800",
      notification: false
    },
  ];

  const bottomItems = [
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <motion.div 
      className="w-80 bg-gradient-to-b from-[#1a1a1a]/80 to-[#2d2d2d]/80 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col relative overflow-hidden"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-blue-500/5 to-teal-500/5"
        animate={{ 
          background: [
            "linear-gradient(to bottom, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05), rgba(20, 184, 166, 0.05))",
            "linear-gradient(to bottom, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))",
            "linear-gradient(to bottom, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05), rgba(20, 184, 166, 0.05))"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Logo Section */}
      <motion.div 
        className="p-8 border-b border-white/10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl blur opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              TRIMMINFLOW
            </h1>
            <p className="text-gray-400 text-sm">Management Suite</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="p-6 border-b border-white/10 relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-gray-800/40 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Today's Progress</span>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">8/12</div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
          <div className="text-yellow-400 text-xs font-medium">67% Complete</div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3 relative z-10">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-4 font-medium">
          Navigation
        </div>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-2xl h-14 relative group transition-all duration-300 ${
                  isActive 
                    ? "bg-white/10 text-white border border-white/20" 
                    : "hover:bg-white/5 text-gray-300 hover:text-white border border-transparent hover:border-white/10"
                }`}
                onClick={() => onScreenChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with gradient background */}
                <div className={`relative mr-4 ${isActive ? 'ml-3' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient}` 
                      : isHovered 
                        ? 'bg-white/10' 
                        : 'bg-white/5'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-current'}`} />
                  </div>
                  
                  {/* Glow effect */}
                  <AnimatePresence>
                    {(isActive || isHovered) && (
                      <motion.div 
                        className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-20`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <span className="font-medium">{item.label}</span>

                {/* Notification indicator */}
                {item.notification && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Hover effect */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/10 space-y-3 relative z-10">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 h-12"
            >
              <Icon className="w-4 h-4 mr-4" />
              {item.label}
            </Button>
          );
        })}
        
        {/* Version info with sparkle effect */}
        <motion.div 
          className="text-center pt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>TRIMMINFLOW v2.0</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* Notification bell */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 relative"
        >
          <Bell className="w-4 h-4 text-gray-400" />
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-xs">3</span>
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
}