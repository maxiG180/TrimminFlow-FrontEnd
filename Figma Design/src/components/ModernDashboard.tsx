import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Plus, 
  Users, 
  Euro, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Scissors,
  Sparkles,
  ArrowUpRight,
  MoreVertical,
  Star
} from "lucide-react";

export function ModernDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const controls = useAnimation();

  const todayAppointments = [
    { 
      id: 1, 
      customer: "John Smith", 
      time: "09:00", 
      barber: "Marco", 
      service: "Signature Cut",
      status: "completed",
      revenue: 45
    },
    { 
      id: 2, 
      customer: "Sarah Johnson", 
      time: "10:30", 
      barber: "Alex", 
      service: "Classic Cut",
      status: "in-progress",
      revenue: 35
    },
    { 
      id: 3, 
      customer: "Mike Davis", 
      time: "14:00", 
      barber: "Marco", 
      service: "The Full Service",
      status: "upcoming",
      revenue: 65
    },
    { 
      id: 4, 
      customer: "Emma Wilson", 
      time: "15:30", 
      barber: "Tony", 
      service: "Beard Sculpting",
      status: "upcoming",
      revenue: 25
    },
  ];

  const statsData = [
    {
      title: "Today's Revenue",
      value: "€294",
      change: "+18%",
      icon: Euro,
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-500/10 to-amber-600/10",
      trend: "up"
    },
    {
      title: "Active Customers",
      value: "12",
      change: "+3 new",
      icon: Users,
      gradient: "from-amber-500 to-yellow-600",
      bgGradient: "from-amber-500/10 to-yellow-600/10",
      trend: "up"
    },
    {
      title: "Next Appointment",
      value: "14:00",
      change: "Mike Davis",
      icon: Clock,
      gradient: "from-yellow-600 to-amber-700",
      bgGradient: "from-yellow-600/10 to-amber-700/10",
      trend: "neutral"
    }
  ];

  const quickStats = [
    { label: "Completed Today", value: "8", color: "text-yellow-400" },
    { label: "Pending", value: "4", color: "text-amber-400" },
    { label: "Rating", value: "4.9", color: "text-yellow-300" },
  ];

  useEffect(() => {
    controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity }
    });
  }, [controls]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "in-progress":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "upcoming":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-600/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 right-32 w-96 h-96 bg-gradient-to-r from-yellow-500/8 to-amber-500/8 rounded-full blur-3xl"
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
      <motion.div 
        className="absolute bottom-32 left-32 w-64 h-64 bg-gradient-to-r from-amber-500/8 to-yellow-500/8 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
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
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Welcome back to TRIMMINFLOW</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold text-lg px-8 py-6 rounded-2xl shadow-2xl">
              <Plus className="w-5 h-5 mr-2" />
              Add Appointment
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div 
          className="flex items-center justify-center gap-8 p-6 rounded-3xl bg-gray-800/30 backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative hover:border-yellow-400/30 transition-all duration-500">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="text-sm text-gray-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                          <Icon className="w-4 h-4 text-black" />
                        </div>
                        {stat.title}
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 90, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-yellow-400" />}
                      <span className={`text-sm ${stat.trend === "up" ? "text-yellow-400" : "text-gray-400"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Today's Appointments */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Today's Appointments</h2>
            <div className="flex gap-2">
              {["today", "week", "month"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={`rounded-xl capitalize ${
                    selectedPeriod === period 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {todayAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                className="group cursor-pointer"
              >
                <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/30 transition-all duration-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{appointment.customer}</h3>
                        <p className="text-gray-400 text-sm">with {appointment.barber}</p>
                        <p className="text-gray-500 text-xs">{appointment.service}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white mb-1">{appointment.time}</div>
                        <div className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(appointment.status)} capitalize`}>
                          {appointment.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">€{appointment.revenue}</span>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 5 }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>

                    {appointment.status === "completed" && (
                      <div className="mt-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-400 ml-2">Excellent service</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-4 gap-6"
        >
          <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Today's Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue Target</span>
                  <span className="text-yellow-400 font-medium">294€ / 400€</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "73.5%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
                <div className="text-sm text-gray-500">73.5% of daily target achieved</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            <CardContent className="p-6">
              <h4 className="text-gray-400 text-sm mb-2">Peak Hours</h4>
              <div className="text-2xl font-bold text-white">14:00-16:00</div>
              <div className="text-amber-400 text-sm">+40% bookings</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            <CardContent className="p-6">
              <h4 className="text-gray-400 text-sm mb-2">Top Barber</h4>
              <div className="text-2xl font-bold text-white">Marco</div>
              <div className="text-yellow-400 text-sm">6 appointments</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}