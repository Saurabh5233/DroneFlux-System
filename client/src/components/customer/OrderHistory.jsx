import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
  }, [user]);

  const fetchOrderHistory = async () => {
    try {
      const response = await ordersAPI.getAll({ 
        customerEmail: user?.email,
        status: 'delivered'
      });
      
      const deliveredOrders = (response.data.orders || [])
        .filter(order => order.status === 'delivered')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(deliveredOrders);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
    } finally {
      setLoading(false);
    }
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
            No Order History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't completed any orders yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const deliveredDate = order.statusHistory.find(h => h.status === 'delivered')?.timestamp;
        
        return (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order {order.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Items: {order.items.join(', ')}
                  </p>
                </div>
                <Badge status="delivered">
                  delivered
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivered To</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivered On</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {deliveredDate ? formatDate(deliveredDate) : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Weight</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.totalWeight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}