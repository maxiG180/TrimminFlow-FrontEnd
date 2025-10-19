import { useState } from "react";
import { ModernSidebar } from "./components/ModernSidebar";
import { ModernDashboard } from "./components/ModernDashboard";
import { Calendar } from "./components/Calendar";
import { QRGenerator } from "./components/QRGenerator";
import { WarmBooking } from "./components/WarmBooking";
import { SaaSLanding } from "./components/SaaSLanding";
import { ModernAddAppointmentModal } from "./components/ModernAddAppointmentModal";
import { Settings } from "./components/Settings";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <ModernDashboard />;
      case "calendar":
        return <Calendar />;
      case "customers":
        return <div className="flex-1 min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white p-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent mb-4">Customers</h1>
          <p className="text-gray-400 text-lg">Customer management coming soon...</p>
        </div>;
      case "qr":
        return <QRGenerator />;
      case "settings":
        return <Settings />;
      case "landing":
        return <SaaSLanding />;
      case "booking":
        return <WarmBooking />;
      default:
        return <ModernDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Show sidebar for management screens, hide for public pages */}
      {!["booking", "landing"].includes(activeScreen) && (
        <ModernSidebar 
          activeScreen={activeScreen} 
          onScreenChange={setActiveScreen} 
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderScreen()}
      </div>

      {/* Modal */}
      <ModernAddAppointmentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {/* Demo Navigation */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          <p className="text-xs text-gray-400 mb-3 font-medium">Demo Navigation:</p>
          <div className="space-y-2">
            <button
              onClick={() => setActiveScreen("landing")}
              className="block w-full text-left text-sm hover:bg-white/10 px-3 py-2 rounded-xl text-white transition-colors"
            >
              SaaS Landing Page
            </button>
            <button
              onClick={() => setActiveScreen("dashboard")}
              className="block w-full text-left text-sm hover:bg-white/10 px-3 py-2 rounded-xl text-white transition-colors"
            >
              Management App
            </button>
            <button
              onClick={() => setActiveScreen("booking")}
              className="block w-full text-left text-sm hover:bg-white/10 px-3 py-2 rounded-xl text-white transition-colors"
            >
              Public Booking Page
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="block w-full text-left text-sm hover:bg-white/10 px-3 py-2 rounded-xl text-white transition-colors"
            >
              Add Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}