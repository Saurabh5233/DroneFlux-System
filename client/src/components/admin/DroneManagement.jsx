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
    model: '',
    serialNumber: '',
    batteryCapacity: '',
    weightLimit: ''
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
      const droneData = {
        ...formData,
        batteryCapacity: parseFloat(formData.batteryCapacity),
        weightLimit: parseFloat(formData.weightLimit),
      };
      await dronesAPI.create(droneData);
      setShowAddModal(false);
      setFormData({ name: '', model: '', serialNumber: '', batteryCapacity: '', weightLimit: '' });
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
          <Card key={drone._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {drone.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {drone.serialNumber}
                  </p>
                </div>
                <Badge status={drone.status}>
                  {drone.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Model:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.model}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Weight Limit:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.weightLimit} kg</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Battery:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{drone.batteryCapacity}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getBatteryColor(drone.batteryCapacity)}`}
                    style={{ width: `${drone.batteryCapacity}%` }}
                  />
                </div>
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
                Drone Model
              </label>
              <Select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              >
                <option value="">Select Model</option>
                <option value="Quadcopter">Quadcopter</option>
                <option value="Hexacopter">Hexacopter</option>
                <option value="Octocopter">Octocopter</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serial Number
              </label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Enter serial number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Battery Capacity (%)
              </label>
              <Input
                type="number"
                value={formData.batteryCapacity}
                onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                placeholder="Enter battery capacity"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight Limit (kg)
              </label>
              <Input
                type="number"
                value={formData.weightLimit}
                onChange={(e) => setFormData({ ...formData, weightLimit: e.target.value })}
                placeholder="Enter weight limit"
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