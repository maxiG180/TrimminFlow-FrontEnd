import { Button } from "./ui/button";
import { Scissors, LayoutDashboard, Calendar, Users, QrCode } from "lucide-react";

interface SidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "customers", label: "Customers", icon: Users },
    { id: "qr", label: "QR Codes", icon: QrCode },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-sidebar-foreground" />
          <h1 className="text-xl font-medium text-sidebar-foreground">TRIMMINFLOW</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start rounded-xl ${
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => onScreenChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          TRIMMINFLOW v1.0
        </div>
      </div>
    </div>
  );
}