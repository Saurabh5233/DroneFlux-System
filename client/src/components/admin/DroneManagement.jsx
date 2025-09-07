import React, { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Badge } from '../ui/Badge';
import { dronesAPI } from '../../services/api';
import { getBatteryLevel } from '../../utils/helpers';

export default function DroneManagement() {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    maxWeight: ''
  });

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const response = await dronesAPI.getAll();
      setDrones(response.data.drones || []);
    } catch (error) {
      console.error('Failed to fetch drones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrone = async (e) => {
    e.preventDefault();
    try {
      await dronesAPI.create(formData);
      setShowAddModal(false);
      setFormData({ name: '', type: '', maxWeight: '' });
      fetchDrones();
    } catch (error) {
      console.error('Failed to add drone:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Drone Fleet Management
        </h3>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Drone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drones.map((drone) => (
          <Card key={drone.id} className="hover:shadow-md transition-shadow">
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
                <Badge status={drone.status}>
                  {drone.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.type}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max Weight:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.maxWeight} kg</span>
                </div>
                
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

                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span className="font-mono">
                    {drone.currentLocation.lat.toFixed(4)}, {drone.currentLocation.lng.toFixed(4)}
                  </span>
                </div>

                {drone.assignedOrder && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Assigned to: {drone.assignedOrder}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Drone Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalHeader onClose={() => setShowAddModal(false)}>
          <h3 className="text-lg font-semibold">Add New Drone</h3>
        </ModalHeader>
        
        <form onSubmit={handleAddDrone}>
          <ModalContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drone Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter drone name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drone Type
              </label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="Quadcopter">Quadcopter</option>
                <option value="Hexacopter">Hexacopter</option>
                <option value="Octocopter">Octocopter</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Weight Capacity (kg)
              </label>
              <Input
                type="number"
                value={formData.maxWeight}
                onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                placeholder="Enter max weight"
                min="1"
                max="20"
                required
              />
            </div>
          </ModalContent>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Drone
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}