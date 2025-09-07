import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Package, Truck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 text-center">
      {/* Hero Section */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-4 bg-blue-600 rounded-full shadow-lg">
            <Plane className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            DroneFlux System
          </h1>
        </div>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mt-4">
          Revolutionizing Logistics with Autonomous Drone Delivery
        </p>
        <div className="mt-10">
          <Link to="/home">
            <button className="px-10 py-5 bg-blue-600 text-white text-xl font-bold rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl w-full">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full inline-block mb-6">
            <Plane className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real-time Tracking</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your drone deliveries with live updates and precise location data.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105">
          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full inline-block mb-6">
            <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Efficient Order Management</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Streamline order processing, assignment, and delivery workflows.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full inline-block mb-6">
            <Truck className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Secure & Reliable</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Ensuring safe and dependable drone operations with robust security measures.
          </p>
        </div>
      </div>
    </div>
  );
}