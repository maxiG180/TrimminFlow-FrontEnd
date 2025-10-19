import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Scissors, 
  Calendar, 
  Users, 
  BarChart3, 
  Clock, 
  Smartphone,
  Check,
  Star,
  ArrowRight,
  Play,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  ChevronRight
} from "lucide-react";

export function SaaSLanding() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered appointment booking that maximizes your revenue and minimizes gaps in your schedule.",
      gradient: "from-yellow-400 to-amber-500"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build lasting relationships with detailed customer profiles, preferences, and appointment history.",
      gradient: "from-amber-400 to-yellow-500"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Real-time insights into your revenue, peak hours, and growth opportunities.",
      gradient: "from-yellow-500 to-amber-400"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Booking",
      description: "Beautiful public booking page that converts browsers into loyal customers.",
      gradient: "from-amber-500 to-yellow-400"
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description: "Reduce no-shows by 80% with automated reminders and smart scheduling algorithms.",
      gradient: "from-yellow-400 to-amber-600"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Go live in under 5 minutes. No technical knowledge required.",
      gradient: "from-amber-400 to-yellow-600"
    }
  ];

  const testimonials = [
    {
      name: "Marcus Rodriguez",
      business: "Elite Cuts Barbershop",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "TRIMMINFLOW transformed my business. Revenue up 40% in just 3 months. The booking system is incredible.",
      rating: 5
    },
    {
      name: "James Wilson",
      business: "The Gentleman's Den",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "My customers love the online booking. No more phone tag, and I can focus on what I do best - cutting hair.",
      rating: 5
    },
    {
      name: "Tony Greco",
      business: "Vintage Barber Co.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      text: "The analytics helped me optimize my schedule. I'm earning 25% more while working the same hours.",
      rating: 5
    }
  ];

  const pricingFeatures = [
    "Unlimited appointments",
    "Custom booking page",
    "Customer management",
    "SMS & email reminders",
    "Business analytics",
    "Mobile app access",
    "24/7 support",
    "QR code generator"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
              {/* Mini wireframe effect */}
              <div className="absolute -top-1 -right-1 w-3 h-3 border border-yellow-300 rounded bg-yellow-400/20 flex items-center justify-center">
                <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold">TRIMMINFLOW</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-yellow-400 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors">Reviews</a>
            <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600">
              Start Free Trial
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-6">
                Trusted by 5,000+ barbershops worldwide
              </Badge>
              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                Modernize Your
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block">
                  Barbershop
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your traditional barbershop into a modern business powerhouse. 
                Increase revenue by 40% with smart scheduling, automated bookings, and customer insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-lg px-8 py-6"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400" />
                  Free 14-day trial
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400" />
                  Setup in 5 minutes
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* App Wireframe Mockup */}
              <div className="relative z-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 overflow-hidden">
                {/* Mock Browser Chrome */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-black/20 rounded-lg px-3 py-1 ml-4">
                    <div className="text-xs text-gray-400">barbershop.trimminflow.com</div>
                  </div>
                </div>

                {/* Mock App Interface */}
                <div className="grid grid-cols-4 gap-4 h-80">
                  {/* Sidebar */}
                  <div className="col-span-1 bg-black/30 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                        <Scissors className="w-3 h-3 text-black" />
                      </div>
                      <div className="h-2 bg-yellow-400/40 rounded w-16"></div>
                    </div>
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <div className="w-4 h-4 bg-yellow-400/60 rounded"></div>
                        <div className="h-2 bg-gray-600 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>

                  {/* Main Content */}
                  <div className="col-span-3 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-yellow-400/80 rounded w-32"></div>
                        <div className="h-2 bg-gray-600 rounded w-48"></div>
                      </div>
                      <div className="h-8 w-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg"></div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1,2,3].map((i) => (
                        <motion.div 
                          key={i}
                          className="bg-black/20 rounded-xl p-3"
                          animate={{ 
                            scale: [1, 1.02, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity 
                          }}
                        >
                          <div className="h-6 w-8 bg-yellow-400/80 rounded mb-2"></div>
                          <div className="h-2 bg-gray-600 rounded w-12 mb-1"></div>
                          <div className="h-1 bg-gray-700 rounded w-16"></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Appointments List */}
                    <div className="bg-black/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-white/70 rounded w-28"></div>
                        <div className="h-2 bg-yellow-400/60 rounded w-12"></div>
                      </div>
                      {[1,2,3,4].map((i) => (
                        <motion.div 
                          key={i}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                          animate={{ 
                            backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,215,0,0.1)", "rgba(255,255,255,0.05)"]
                          }}
                          transition={{ 
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity 
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                            <div className="space-y-1">
                              <div className="h-2 bg-white/60 rounded w-20"></div>
                              <div className="h-1 bg-gray-700 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="h-2 bg-yellow-400/70 rounded w-12"></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Calendar Preview */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 21 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-black/20 rounded flex items-center justify-center">
                          <div className={`w-2 h-2 rounded ${
                            i === 10 || i === 15 ? 'bg-yellow-400' : 
                            i === 7 || i === 12 ? 'bg-amber-500' : 'bg-gray-600'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-60"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full blur-3xl opacity-40"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block">
                Scale Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From appointment scheduling to customer insights, TRIMMINFLOW gives you the complete toolkit 
              to modernize your barbershop and maximize revenue.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-yellow-400/30 transition-all duration-300 h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                        <Icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-400/5 to-amber-500/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {[
                { metric: "5,000+", label: "Active Barbershops" },
                { metric: "1M+", label: "Appointments Booked" },
                { metric: "40%", label: "Average Revenue Increase" },
                { metric: "4.9/5", label: "Customer Rating" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.metric}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">What Barbers Are Saying</h2>
            <p className="text-xl text-gray-300">Real stories from real barbershops</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-yellow-400/30 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.business}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300">Everything you need to grow your barbershop</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2 rounded-b-xl font-bold">
                Most Popular
              </div>
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">Professional Plan</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-6xl font-bold text-yellow-400">€29</span>
                    <span className="text-gray-400 text-xl">/month</span>
                  </div>
                  <p className="text-gray-300">Perfect for individual barbershops and small teams</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {pricingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-lg py-6"
                  >
                    Start Free 14-Day Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-sm text-gray-400">No credit card required • Cancel anytime</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block">
                Barbershop Business?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful barbershops using TRIMMINFLOW to increase revenue and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Scissors className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold">TRIMMINFLOW</span>
            </div>
            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 TRIMMINFLOW. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}