import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Save, 
  Building2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Palette,
  Globe,
  Bell,
  Shield,
  Camera,
  Scissors,
  Settings as SettingsIcon,
  CheckCircle
} from "lucide-react";

export function Settings() {
  const [businessName, setBusinessName] = useState("TRIMMINFLOW");
  const [description, setDescription] = useState("Premium barbershop offering modern cuts and traditional grooming services in the heart of downtown.");
  const [email, setEmail] = useState("info@trimminflow.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Main Street, Downtown");
  const [website, setWebsite] = useState("trimminflow.com");
  
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [theme, setTheme] = useState("dark");

  const settingsSections = [
    {
      title: "Business Profile",
      icon: Building2,
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      title: "Operating Hours",
      icon: Clock,
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      title: "Contact Information",
      icon: Phone,
      gradient: "from-yellow-600 to-amber-700"
    },
    {
      title: "Booking Settings",
      icon: Globe,
      gradient: "from-amber-600 to-yellow-700"
    },
    {
      title: "Appearance",
      icon: Palette,
      gradient: "from-yellow-700 to-amber-800"
    }
  ];

  const days = [
    { id: 'monday', label: 'Monday', open: '09:00', close: '18:00', enabled: true },
    { id: 'tuesday', label: 'Tuesday', open: '09:00', close: '18:00', enabled: true },
    { id: 'wednesday', label: 'Wednesday', open: '09:00', close: '18:00', enabled: true },
    { id: 'thursday', label: 'Thursday', open: '09:00', close: '18:00', enabled: true },
    { id: 'friday', label: 'Friday', open: '09:00', close: '19:00', enabled: true },
    { id: 'saturday', label: 'Saturday', open: '09:00', close: '17:00', enabled: true },
    { id: 'sunday', label: 'Sunday', open: '10:00', close: '16:00', enabled: false },
  ];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        className="absolute top-32 right-40 w-96 h-96 bg-gradient-to-r from-yellow-500/8 to-amber-500/8 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-400 text-lg">Manage your barbershop profile and preferences</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold text-lg px-8 py-6 rounded-2xl shadow-2xl">
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <motion.div 
            className="lg:col-span-1 space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-gray-300 mb-4">Settings Categories</h3>
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${section.gradient} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-white group-hover:text-yellow-300 transition-colors">
                          {section.title}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-black" />
                    </div>
                    Business Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Business Name</Label>
                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Website</Label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Business Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                    />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                    <Camera className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">Business Logo</p>
                      <p className="text-gray-400 text-sm">Upload your barbershop logo for the booking page</p>
                    </div>
                    <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-black" />
                    </div>
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {days.map((day) => (
                    <div key={day.id} className="flex items-center gap-4 p-4 bg-gray-700/20 rounded-2xl">
                      <div className="w-24">
                        <Label className="text-gray-300">{day.label}</Label>
                      </div>
                      <Switch checked={day.enabled} className="data-[state=checked]:bg-yellow-500" />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Select defaultValue={day.open}>
                          <SelectTrigger className="bg-gray-600/30 border-gray-600/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Select defaultValue={day.close}>
                          <SelectTrigger className="bg-gray-600/30 border-gray-600/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-700 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-black" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl focus:border-yellow-500/50 focus:bg-gray-700/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Booking Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-700 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-black" />
                    </div>
                    Booking Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Enable Online Booking</p>
                          <p className="text-gray-400 text-sm">Allow customers to book appointments online</p>
                        </div>
                      </div>
                      <Switch 
                        checked={bookingEnabled} 
                        onCheckedChange={setBookingEnabled}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-700/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">Receive email alerts for new bookings</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications} 
                        onCheckedChange={setNotifications}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-700/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Auto-Confirm Bookings</p>
                          <p className="text-gray-400 text-sm">Automatically confirm new appointments</p>
                        </div>
                      </div>
                      <Switch 
                        checked={autoConfirm} 
                        onCheckedChange={setAutoConfirm}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-700 to-amber-800 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    Booking Page Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Primary Color</Label>
                      <Select value={primaryColor} onValueChange={setPrimaryColor}>
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="teal">Teal</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Theme Style</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Scissors className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-medium">Preview</h4>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Changes will be reflected on your public booking page immediately after saving.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}