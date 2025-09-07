import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Drone, 
  Package, 
  MapPin, 
  Clock, 
  BarChart3, 
  Shield,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Drone className="w-8 h-8 text-blue-400" />,
      title: "Drone Management",
      description: "Monitor and control your entire drone fleet in real-time"
    },
    {
      icon: <Package className="w-8 h-8 text-blue-400" />,
      title: "Order Processing",
      description: "Efficient order handling from receipt to delivery"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-400" />,
      title: "Real-time Tracking",
      description: "Track all deliveries with live location updates"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-400" />,
      title: "Automated Scheduling",
      description: "AI-powered route optimization and drone scheduling"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and performance metrics"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Geofencing",
      description: "Define safe flight zones and receive alerts for unauthorized areas"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Order Processing",
      description: "Customers place orders that are automatically processed and validated by our system"
    },
    {
      number: "2", 
      title: "Drone Assignment",
      description: "AI algorithms assign the optimal drone based on package size, destination, and weather conditions"
    },
    {
      number: "3",
      title: "Delivery Execution", 
      description: "Drones execute delivery with real-time tracking and status updates for both operators and customers"
    }
  ];

  const testimonials = [
    {
      rating: 5,
      text: "DroneFlux has transformed our delivery logistics, cutting delivery times by 50% and significantly improving customer satisfaction.",
      author: "Sarah Johnson",
      position: "Operations Director, EcoDeliveries"
    },
    {
      rating: 5,
      text: "The real-time tracking and analytics have given us unprecedented visibility into our delivery operations.",
      author: "Michael Chen",
      position: "CEO, FastTrack Logistics"
    },
    {
      rating: 5,
      text: "The geofencing feature ensures our drones operate safely in complex urban environments. It's a game-changer for compliance.",
      author: "David Rodriguez", 
      position: "Safety Officer, UrbanAir"
    }
  ];

  const companies = [
    "EcoDeliveries",
    "FastTrack Logistics", 
    "UrbanAir",
    "SkyDrop",
    "DeliverEase"
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Drone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">DroneFlux</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <button className="p-2 hover:bg-slate-700 rounded">
                <div className="w-5 h-5 bg-slate-600 rounded"></div>
              </button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Log in</button>
              <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-slate-700 rounded"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
                <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
                <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
                <button className="text-blue-400 hover:text-blue-300 transition-colors text-left">Log in</button>
                <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors w-fit">
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
                🚁 Welcome to the future of delivery
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Revolutionize <span className="text-blue-400">Drone</span><br />
                <span className="text-blue-400">Delivery</span> Management
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                DroneFlux delivers a comprehensive solution for managing your drone fleet,
                optimizing delivery routes, and providing real-time tracking for your customers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="flex items-center justify-center px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-lg font-medium">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="flex items-center justify-center px-8 py-3 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors text-lg">
                  Watch Demo
                  <div className="ml-2 w-8 h-5 bg-slate-600 rounded"></div>
                </button>
              </div>

              <div className="space-y-2 text-slate-400">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  14-day free trial
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="w-full h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <Drone className="w-24 h-24 text-blue-400" />
                </div>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-lg mb-4">Features</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Comprehensive Drone<br />Management
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to manage your drone delivery operations efficiently in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-lg mb-4">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Streamlined Drone Delivery Process
            </h2>
            <p className="text-xl text-slate-300">
              From order placement to successful delivery, our platform handles every step efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    {step.number}
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-slate-700 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-lg font-medium">
              Start Using DroneFlux <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-lg mb-4">Testimonials</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-slate-300">
              See what our customers have to say about the DroneFlux platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-slate-400 text-sm">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {companies.map((company, index) => (
                <div key={index} className="text-slate-400 text-lg font-medium">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Drone className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">DroneFlux</span>
            </div>
            
            <div className="text-slate-400 text-sm">
              © 2025 DroneFlux. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;