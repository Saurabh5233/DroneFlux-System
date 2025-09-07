import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Plane } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Modal, ModalHeader, ModalContent } from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Badge } from '../ui/Badge';
import { ordersAPI, dronesAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const [ordersResponse, dronesResponse] = await Promise.all([
        ordersAPI.getAll(params),
        dronesAPI.getAll()
      ]);
      
      setOrders(ordersResponse.data.orders || []);
      setDrones(dronesResponse.data.drones || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await ordersAPI.approve(orderId);
      fetchData();
    } catch (error) {
      console.error('Failed to approve order:', error);
    }
  };

  const handleDenyOrder = async (orderId) => {
    if (confirm('Are you sure you want to deny this order?')) {
      try {
        await ordersAPI.delete(orderId);
        fetchData();
      } catch (error) {
        console.error('Failed to deny order:', error);
      }
    }
  };

  const handleAssignDrone = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    const availableDrones = drones.filter(d => 
      d.status === 'available' && d.maxWeight >= order.totalWeight
    );

    if (availableDrones.length === 0) {
      alert('No available drones with sufficient capacity.');
      return;
    }

    try {
      await ordersAPI.assignDrone(orderId, availableDrones[0].id);
      fetchData();
    } catch (error) {
      console.error('Failed to assign drone:', error);
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Management
        </h3>
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </Select>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order {order.id}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.customerName} - {order.customerEmail}
                  </p>
                </div>
                <Badge status={order.status}>
                  {order.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.items.join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.totalWeight} kg
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pickup</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.pickupAddress}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Delivery</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showOrderDetails(order)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>

                {order.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApproveOrder(order.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDenyOrder(order.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                  </>
                )}

                {order.status === 'approved' && !order.assignedDrone && (
                  <Button
                    size="sm"
                    onClick={() => handleAssignDrone(order.id)}
                  >
                    <Plane className="h-4 w-4 mr-1" />
                    Assign Drone
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      <Modal 
        isOpen={showOrderModal} 
        onClose={() => setShowOrderModal(false)}
        className="max-w-2xl"
      >
        <ModalHeader onClose={() => setShowOrderModal(false)}>
          <h3 className="text-lg font-semibold">Order Details</h3>
        </ModalHeader>
        
        {selectedOrder && (
          <ModalContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="font-medium">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge status={selectedOrder.status}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{selectedOrder.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              {selectedOrder.estimatedDelivery && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Est. Delivery</p>
                  <p className="font-medium">{formatDate(selectedOrder.estimatedDelivery)}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status History</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedOrder.statusHistory.map((history, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="capitalize">{history.status}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(history.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ModalContent>
        )}
      </Modal>
    </div>
  );
}