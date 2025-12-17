"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Check, Star, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      iconSvg: "/svg_custom/schedule-svgrepo-com.svg",
      titleKey: 'appointment' as const,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      iconSvg: "/svg_custom/people-who-support-svgrepo-com.svg",
      titleKey: 'customer' as const,
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      iconSvg: "/svg_custom/analytics-chart-diagram-pie-svgrepo-com.svg",
      titleKey: 'analytics' as const,
      gradient: "from-yellow-500 to-amber-400",
    },
    {
      iconSvg: "/svg_custom/phone-svgrepo-com.svg",
      titleKey: 'mobile' as const,
      gradient: "from-amber-500 to-yellow-400",
    },
    {
      iconSvg: "/svg_custom/clock-svgrepo-com.svg",
      titleKey: 'time' as const,
      gradient: "from-yellow-400 to-amber-600",
    },
    {
      iconSvg: "/svg_custom/electric_6994630.png",
      titleKey: 'setup' as const,
      gradient: "from-amber-400 to-yellow-600",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Rodriguez",
      business: "Elite Cuts Barbershop",
      text: "TRIMMINFLOW transformed my business. Revenue up 40% in just 3 months. The booking system is incredible.",
      rating: 5,
    },
    {
      name: "James Wilson",
      business: "The Gentleman's Den",
      text: "My customers love the online booking. No more phone tag, and I can focus on what I do best - cutting hair.",
      rating: 5,
    },
    {
      name: "Tony Greco",
      business: "Vintage Barber Co.",
      text: "The analytics helped me optimize my schedule. I'm earning 25% more while working the same hours.",
      rating: 5,
    },
  ];

  const pricingFeatures = [
    "Unlimited appointments",
    "Custom booking page",
    "Customer management",
    "SMS & email reminders",
    "Business analytics",
    "Mobile app access",
    "24/7 support",
    "QR code generator",
  ];

  const navLinks = [
    { href: "#features", label: "Features", variant: "default" as const },
    { href: "#pricing", label: "Pricing", variant: "default" as const },
    { href: "#testimonials", label: "Reviews", variant: "default" as const },
    {
      href: "/dashboard",
      label: "Dashboard",
      variant: "outline" as const,
      requiresAuth: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white" suppressHydrationWarning>
      {/* Header */}
      <Navbar links={navLinks} showAuth={true} />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1 mb-4 sm:mb-6 text-xs sm:text-sm">
                {t.hero.badge}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading mb-4 sm:mb-6 tracking-tight">
                {t.hero.title}
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block font-heading">
                  {t.hero.subtitle}
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
                <Link
                  href="/dashboard"
                  className="border border-white/20 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t.hero.ctaSecondary}
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t.hero.feature1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t.hero.feature2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t.hero.feature3}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Dashboard Screenshot */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/img/image.png"
                  alt="TrimminFlow Dashboard"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6 tracking-tight">
              {t.features.title}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block font-heading">
                {t.features.subtitle}
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-yellow-400/30 transition-all group"
              >
                <Image
                  src={feature.iconSvg}
                  alt={t.features[feature.titleKey].title}
                  width={64}
                  height={64}
                  className={`object-contain mb-4 sm:mb-6 group-hover:scale-110 transition-transform ${feature.iconSvg.includes('people-who-support')
                    ? 'w-14 h-14 sm:w-20 sm:h-20'
                    : 'w-12 h-12 sm:w-16 sm:h-16'
                    }`}
                />
                <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 sm:mb-4 tracking-wide">
                  {t.features[feature.titleKey].title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">{t.features[feature.titleKey].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6 tracking-tight">
              What Barbers Are Saying
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {testimonial.business}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h2>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-yellow-400/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-b-lg sm:rounded-b-xl font-bold text-sm sm:text-base">
              Most Popular
            </div>
            <div className="text-center mb-6 sm:mb-8 mt-6 sm:mt-0">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-3 sm:mb-4 tracking-wide">
                Professional Plan
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-400">€29</span>
                <span className="text-gray-400 text-lg sm:text-xl">/month</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium"
              >
                Start Free 14-Day Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 TRIMMINFLOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
