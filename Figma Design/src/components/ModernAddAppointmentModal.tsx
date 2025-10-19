import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Calendar, Clock, User, Scissors, Sparkles, CheckCircle } from "lucide-react";

interface ModernAddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModernAddAppointmentModal({ isOpen, onClose }: ModernAddAppointmentModalProps) {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const services = [
    { value: "signature", label: "Signature Cut", price: "€45", duration: "60 min" },
    { value: "classic", label: "Classic Cut", price: "€35", duration: "45 min" },
    { value: "beard", label: "Beard Sculpting", price: "€25", duration: "30 min" },
    { value: "combo", label: "The Full Service", price: "€65", duration: "90 min" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <CardHeader className="pb-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Add New Appointment</CardTitle>
                    <p className="text-gray-400">Schedule a new customer visit</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white w-10 h-10 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Customer Info Section */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Customer Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name" className="text-gray-300">Customer Name</Label>
                    <Input 
                      id="customer-name" 
                      placeholder="John Doe"
                      className="bg-white/5 border-white/20 text-white rounded-2xl focus:border-amber-500/50 focus:bg-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone" className="text-gray-300">Phone Number</Label>
                    <Input 
                      id="customer-phone" 
                      placeholder="+1 (555) 123-4567"
                      className="bg-white/5 border-white/20 text-white rounded-2xl focus:border-amber-500/50 focus:bg-white/10"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Service Selection */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Service Selection</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <motion.button
                      key={service.value}
                      onClick={() => setSelectedService(service.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedService === service.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{service.label}</h4>
                        <span className="text-amber-400 font-bold">{service.price}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{service.duration}</p>
                      {selectedService === service.value && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 mt-2 text-amber-400"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Barber & Date Selection */}
              <motion.div 
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-2">
                  <Label className="text-gray-300">Select Barber</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-2xl focus:border-amber-500/50">
                      <SelectValue placeholder="Choose a barber" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="marco">Marco - Senior Barber</SelectItem>
                      <SelectItem value="alex">Alex - Styling Specialist</SelectItem>
                      <SelectItem value="tony">Tony - Beard Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Select Date</Label>
                  <Input 
                    type="date" 
                    className="bg-white/5 border-white/20 text-white rounded-2xl focus:border-amber-500/50"
                    defaultValue="2024-03-20"
                  />
                </div>
              </motion.div>

              {/* Time Selection */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Available Time Slots</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.slice(0, 12).map((time) => (
                    <motion.button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/20 hover:border-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl border-white/20 text-gray-300 hover:bg-white/5 hover:text-white py-6"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold rounded-2xl py-6 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Confirm Appointment
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}