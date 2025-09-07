import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plane, Moon, Sun, LogOut, BarChart3, Settings, Package, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import AdminOverview from './AdminOverview';
import DroneManagement from './DroneManagement';
import OrderManagement from './OrderManagement';
import LiveTracking from './LiveTracking';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3, component: AdminOverview },
    { id: 'drones', name: 'Drone Management', icon: Plane, component: DroneManagement },
    { id: 'orders', name: 'Order Management', icon: Package, component: OrderManagement },
    { id: 'tracking', name: 'Live Tracking', icon: MapPin, component: LiveTracking },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              DroneFlux Admin
            </h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {navigation.find(nav => nav.id === activeSection)?.name}
            </h2>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {(() => {
            const ActiveComponent = navigation.find(nav => nav.id === activeSection)?.component;
            return ActiveComponent ? <ActiveComponent /> : <AdminOverview />;
          })()}
        </main>
      </div>
    </div>
  );
}
