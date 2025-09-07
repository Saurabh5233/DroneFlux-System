import React, { useEffect, useState } from 'react';
import { Plane, Package, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { dronesAPI, ordersAPI } from '../../services/api';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalDrones: 0,
    activeDeliveries: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dronesResponse, ordersResponse] = await Promise.all([
          dronesAPI.getAll(),
          ordersAPI.getAll()
        ]);

        const drones = dronesResponse.data.drones || [];
        const orders = ordersResponse.data.orders || [];

        setStats({
          totalDrones: drones.length,
          activeDeliveries: orders.filter(o => o.status === 'in-transit').length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'delivered').length
        });

        // Mock recent activity
        setRecentActivity([
          {
            icon: Plane,
            text: 'DRONE002 started delivery for Order ORD001',
            time: '2 minutes ago',
            color: 'text-blue-600'
          },
          {
            icon: CheckCircle,
            text: 'Order ORD003 delivered successfully',
            time: '1 hour ago',
            color: 'text-green-600'
          },
          {
            icon: Package,
            text: 'New drone DRONE003 added to fleet',
            time: '2 hours ago',
            color: 'text-purple-600'
          }
        ]);

      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { icon: Plane, label: 'Total Drones', value: stats.totalDrones, color: 'bg-blue-500' },
    { icon: Package, label: 'Active Deliveries', value: stats.activeDeliveries, color: 'bg-orange-500' },
    { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500' },
    { icon: CheckCircle, label: 'Completed Orders', value: stats.completedOrders, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`p-2 rounded-full bg-white dark:bg-gray-600 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
