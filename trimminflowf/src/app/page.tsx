'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
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
} from "lucide-react";

export default function Home() {
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
      text: "TRIMMINFLOW transformed my business. Revenue up 40% in just 3 months. The booking system is incredible.",
      rating: 5
    },
    {
      name: "James Wilson",
      business: "The Gentleman's Den",
      text: "My customers love the online booking. No more phone tag, and I can focus on what I do best - cutting hair.",
      rating: 5
    },
    {
      name: "Tony Greco",
      business: "Vintage Barber Co.",
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

  const navLinks = [
    { href: '#features', label: 'Features', variant: 'default' as const },
    { href: '#pricing', label: 'Pricing', variant: 'default' as const },
    { href: '#testimonials', label: 'Reviews', variant: 'default' as const },
    { href: '/dashboard', label: 'Dashboard', variant: 'outline' as const, requiresAuth: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <Navbar links={navLinks} showAuth={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-4 py-1 mb-6 text-sm">
                Trusted by 5,000+ barbershops worldwide
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight">
                Modernize Your
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block font-heading">
                  Barbershop
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your traditional barbershop into a modern business powerhouse.
                Increase revenue by 40% with smart scheduling, automated bookings, and customer insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/auth/register" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-lg px-8 py-4 rounded-lg font-medium flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/dashboard" className="border border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-lg font-medium flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  View Demo
                </Link>
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
              {/* Screenshot Placeholder */}
              <div className="relative z-10 bg-gray-800/30 backdrop-blur-xl rounded-3xl border-2 border-dashed border-white/20 p-12 overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 font-medium">App Screenshot</p>
                  <p className="text-gray-600 text-sm mt-1">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold font-heading mb-6 tracking-tight">
              Everything You Need to
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block font-heading">
                Scale Your Business
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-yellow-400/30 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4 tracking-wide">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold font-heading mb-6 tracking-tight">What Barbers Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold font-heading mb-6 tracking-tight">Simple, Transparent Pricing</h2>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2 rounded-b-xl font-bold">
              Most Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold font-heading mb-4 tracking-wide">Professional Plan</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-6xl font-bold text-yellow-400">€29</span>
                <span className="text-gray-400 text-xl">/month</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/auth/register" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-lg px-8 py-4 rounded-lg font-medium">
                Start Free 14-Day Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 TRIMMINFLOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
