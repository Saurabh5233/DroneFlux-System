import React, { useState, useEffect } from 'react';
import { MapPin, Battery } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { dronesAPI, ordersAPI } from '../../services/api';
import { getBatteryLevel, formatDate } from '../../utils/helpers';

export default function LiveTracking() {
  const [activeDrones, setActiveDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveDrones();
    const interval = setInterval(fetchActiveDrones, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveDrones = async () => {
    try {
      const [dronesResponse, ordersResponse] = await Promise.all([
        dronesAPI.getAll(),
        ordersAPI.getAll()
      ]);

      const drones = dronesResponse.data.drones || [];
      const orders = ordersResponse.data.orders || [];
      
      const activeDroneData = drones
        .filter(drone => drone.status === 'in-transit')
        .map(drone => ({
          ...drone,
          order: orders.find(order => order.id === drone.assignedOrder)
        }));

      setActiveDrones(activeDroneData);
    } catch (error) {
      console.error('Failed to fetch active drones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBatteryColor = (battery) => {
    const level = getBatteryLevel(battery);
    if (level === 'high') return 'bg-green-500';
    if (level === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  if (activeDrones.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Active Deliveries
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All drones are currently available or charging.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Drone Tracking
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeDrones.map((drone) => (
          <Card key={drone.id} className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {drone.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {drone.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">LIVE</span>
                </div>
              </div>

              {drone.order && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Order:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{drone.order.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{drone.order.customerName}</span>
                  </div>
                  {drone.order.estimatedDelivery && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">ETA:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(drone.order.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Battery:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.battery}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getBatteryColor(drone.battery)}`}
                    style={{ width: `${drone.battery}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {drone.currentLocation.lat.toFixed(4)}, {drone.currentLocation.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}