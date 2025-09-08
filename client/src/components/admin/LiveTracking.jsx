import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Battery } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ordersAPI } from '../../services/api';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function LiveTracking() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const droneLocationsRef = useRef({});

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await ordersAPI.getAll({ status: 'delivering' });
        const orders = response.data.orders || [];
        setActiveOrders(orders);

        // Initialize drone locations
        const initialLocations = {};
        orders.forEach(order => {
          if (order.assignedDrone) {
            initialLocations[order.assignedDrone._id] = {
              lat: order.assignedDrone.latitude,
              lng: order.assignedDrone.longitude,
              battery: order.assignedDrone.batteryCapacity,
            };
          }
        });
        droneLocationsRef.current = initialLocations;

      } catch (error) {
        console.error('Failed to fetch active orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrders();

    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('droneLocationUpdate', (data) => {
      const { droneId, latitude, longitude, batteryCapacity } = data;
      
      droneLocationsRef.current[droneId] = {
        lat: latitude,
        lng: longitude,
        battery: batteryCapacity,
      };
      // Force a re-render by updating the state
      setActiveOrders(prevOrders => [...prevOrders]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Active Deliveries
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no drones currently in transit.
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

      <Card>
        <CardContent className="p-0" style={{ height: '600px' }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {activeOrders.map(order => {
              const drone = order.assignedDrone;
              if (!drone) return null;

              const location = droneLocationsRef.current[drone._id];
              if (!location || location.lat === 0) return null;

              return (
                <Marker key={drone._id} position={[location.lat, location.lng]}>
                  <Popup>
                    <b>{drone.name}</b><br />
                    Order: #{order._id.substring(0, 7)}<br />
                    Battery: {location.battery}%
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}
