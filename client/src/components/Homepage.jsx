// client/src/components/Homepage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Shield, User } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-primary-600 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              DroneFlux System
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Advanced Drone Delivery Management Platform
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Admin Card */}
          <Link to="/auth/admin">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-700 transition-colors">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Admin Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage drones, approve orders, and track deliveries
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Customer Card */}
          <Link to="/auth/customer">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-700 transition-colors">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Customer Portal
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track your orders and delivery status
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plane className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Tracking</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Track drone locations and delivery status in real-time
            </p>
          </div>
          
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Management</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Advanced security features for safe operations
            </p>
          </div>
          
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User-friendly</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Intuitive interface for both admins and customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}