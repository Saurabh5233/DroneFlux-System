import React, { useState, useEffect } from 'react';
import { Package, MapPin, Battery, Truck } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI, dronesAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      const [ordersResponse, dronesResponse] = await Promise.all([
        ordersAPI.getAll({ customerEmail: user?.email }),
        dronesAPI.getAll()
      ]);
      
      const allOrders = ordersResponse.data.orders || [];
      const activeOrders = allOrders.filter(order => 
        ['pending', 'approved', 'assigned', 'in-transit'].includes(order.status)
      );
      
      setOrders(activeOrders);
      setDrones(dronesResponse.data.drones || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = (status) => {
    const steps = ['pending', 'approved', 'assigned', 'in-transit', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const getStepIcon = (step) => {
    const icons = {
      pending: Package,
      approved: '✓',
      assigned: Truck,
      'in-transit': MapPin,
      delivered: '✓'
    };
    return icons[step] || Package;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Active Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any orders being tracked right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const drone = order.assignedDrone ? drones.find(d => d.id === order.assignedDrone) : null;
        const progress = getOrderProgress(order.status);

        return (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order {order.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Items: {order.items.join(', ')}
                  </p>
                </div>
                <Badge status={order.status}>
                  {order.status}
                </Badge>
              </div>

              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  {progress.map((item, index) => (
                    <div key={item.step} className="flex flex-col items-center relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        item.completed 
                          ? 'bg-green-500 text-white' 
                          : item.active 
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}>
                        {typeof getStepIcon(item.step) === 'string' ? 
                          getStepIcon(item.step) : 
                          React.createElement(getStepIcon(item.step), { className: "h-4 w-4" })
                        }
                      </div>
                      <span className={`text-xs mt-2 capitalize ${
                        item.active ? 'text-primary-600 font-medium' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {item.step.replace('-', ' ')}
                      </span>
                      {index < progress.length - 1 && (
                        <div className={`absolute top-4 left-8 w-full h-0.5 ${
                          item.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`} style={{ width: 'calc(100% + 2rem)' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </div>

              {/* Drone Information */}
              {drone && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Assigned Drone: {drone.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Drone ID</p>
                      <p className="font-mono text-blue-900 dark:text-blue-300">{drone.id}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Current Location</p>
                      <p className="font-mono text-blue-900 dark:text-blue-300">
                        {drone.currentLocation.lat.toFixed(4)}, {drone.currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Battery Level</p>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        <span className="text-blue-900 dark:text-blue-300">{drone.battery}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'in-transit' && (
                    <div className="flex items-center gap-2 mt-3 justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Live Tracking Active
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}