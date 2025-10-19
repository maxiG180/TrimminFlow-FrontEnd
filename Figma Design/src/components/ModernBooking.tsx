import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Scissors, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Quote
} from "lucide-react";

export function ModernBooking() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const services = [
    { 
      id: "signature", 
      name: "Signature Cut", 
      price: "€45", 
      duration: "60 min",
      description: "Our premium haircut service with styling",
      popular: true
    },
    { 
      id: "classic", 
      name: "Classic Cut", 
      price: "€35", 
      duration: "45 min",
      description: "Traditional barbering with precision"
    },
    { 
      id: "beard", 
      name: "Beard Sculpting", 
      price: "€25", 
      duration: "30 min",
      description: "Expert beard trimming and shaping"
    },
    { 
      id: "combo", 
      name: "The Full Service", 
      price: "€65", 
      duration: "90 min",
      description: "Complete grooming experience",
      premium: true
    },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
  ];

  const testimonials = [
    {
      name: "Marcus Thompson",
      text: "Absolutely incredible experience. The attention to detail is unmatched.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "David Chen",
      text: "Best barbershop in the city. Professional service every time.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "James Rodriguez",
      text: "The atmosphere and quality are second to none. Highly recommended.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    if (selectedService && selectedDate) {
      setIsFormVisible(true);
    }
  }, [selectedService, selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Floating geometric shapes */}
      <motion.div 
        className="fixed top-20 right-20 w-32 h-32 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="fixed bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: y1, opacity }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1723101917533-4fc9149c3684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBkYXJrfGVufDF8fHx8MTc1ODA5NjM1OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Barbershop Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Scissors className="w-12 h-12 text-amber-400" />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
              TRIMMINFLOW
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where traditional craftsmanship meets modern luxury. Experience the art of grooming redefined.
          </motion.p>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-amber-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5" />
              <span>Open Daily 9AM-7PM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>Downtown Location</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Book Your Experience
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="booking"
        className="py-24 px-6"
        style={{ y: y2 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose from our curated selection of premium grooming services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedService(service.id)}
              >
                <Card className={`bg-gradient-to-br from-gray-900 to-black border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-amber-500/50 ${
                  selectedService === service.id ? 'ring-2 ring-amber-500 border-amber-500' : ''
                }`}>
                  {service.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </div>
                  )}
                  {service.premium && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      PREMIUM
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      <div className="text-2xl font-bold text-amber-400">{service.price}</div>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                      {selectedService === service.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-amber-400"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Selected</span>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Split Layout - Date/Time Selection and Form */}
          {selectedService && (
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 items-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Left Side - Date and Time Selection */}
              <div className="space-y-8">
                {/* Date Selection */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Select Date</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                      const dayNum = date.getDate();
                      
                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                            selectedDate === dateStr
                              ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400'
                              : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-sm opacity-70">{dayName}</div>
                          <div className="text-lg font-bold">{dayNum}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">Available Times</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTime(time)}
                          className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          }`}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Side - Booking Form and Visual Content */}
              <div className="space-y-8">
                {/* Booking Form */}
                {isFormVisible && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 rounded-3xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Complete Your Booking</h3>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                              <Input 
                                id="firstName"
                                placeholder="John"
                                className="bg-gray-800 border-gray-700 text-white rounded-xl focus:border-amber-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                              <Input 
                                id="lastName"
                                placeholder="Doe"
                                className="bg-gray-800 border-gray-700 text-white rounded-xl focus:border-amber-500"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                            <Input 
                              id="phone"
                              placeholder="+1 (555) 123-4567"
                              className="bg-gray-800 border-gray-700 text-white rounded-xl focus:border-amber-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email (Optional)</Label>
                            <Input 
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              className="bg-gray-800 border-gray-700 text-white rounded-xl focus:border-amber-500"
                            />
                          </div>

                          {/* Booking Summary */}
                          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h4 className="text-lg font-bold text-white mb-4">Booking Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Service:</span>
                                <span className="text-white">{services.find(s => s.id === selectedService)?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Date:</span>
                                <span className="text-white">{selectedDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Time:</span>
                                <span className="text-white">{selectedTime}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-amber-400">{services.find(s => s.id === selectedService)?.price}</span>
                              </div>
                            </div>
                          </div>

                          <Button 
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-lg py-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
                          >
                            <Calendar className="w-5 h-5 mr-2" />
                            Confirm Booking
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Visual Content */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1732314287829-f1da598a5b77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiYXJiZXIlMjBjdXR0aW5nJTIwaGFpcnxlbnwxfHx8fDE3NTgwNTA5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Professional Barber"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1629881544138-c45fc917eb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXJiZXJzaG9wJTIwY2hhaXJ8ZW58MXx8fHwxNzU4MDk2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Luxury Chair"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">What Our Clients Say</h2>
            <p className="text-xl text-gray-400">Experience speaks louder than words</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-3xl">
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 text-amber-400 mb-4" />
                    <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-white font-medium">{testimonial.name}</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Scissors className="w-8 h-8 text-amber-400" />
            <h3 className="text-2xl font-bold text-white">TRIMMINFLOW</h3>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>123 Main St, Downtown</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5" />
              <span>@trimminflow</span>
            </div>
          </div>
          
          <p className="text-gray-500">© 2024 TRIMMINFLOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}