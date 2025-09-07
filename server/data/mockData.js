export const mockData = {
  drones: [
    {
      id: "DRONE001",
      name: "SkyCarrier Alpha",
      type: "Quadcopter",
      status: "available",
      battery: 85,
      maxWeight: 5,
      currentLocation: { lat: 19.0760, lng: 72.8777 },
      assignedOrder: null
    },
    {
      id: "DRONE002", 
      name: "AirTransport Beta",
      type: "Hexacopter",
      status: "in-transit",
      battery: 67,
      maxWeight: 8,
      currentLocation: { lat: 19.0896, lng: 72.8656 },
      assignedOrder: "ORD001"
    },
    {
      id: "DRONE003",
      name: "SwiftDelivery Gamma",
      type: "Octocopter", 
      status: "charging",
      battery: 23,
      maxWeight: 12,
      currentLocation: { lat: 19.0728, lng: 72.8826 },
      assignedOrder: null
    }
  ],
  orders: [
    {
      id: "ORD001",
      customerId: "CUST001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      items: ["MacBook Pro", "iPhone Case"],
      totalWeight: 2.5,
      pickupAddress: "Warehouse A, Mumbai",
      deliveryAddress: "Bandra West, Mumbai",
      status: "in-transit",
      assignedDrone: "DRONE002",
      estimatedDelivery: "2025-09-05T15:30:00Z",
      createdAt: "2025-09-05T10:00:00Z",
      statusHistory: [
        { status: "pending", timestamp: "2025-09-05T10:00:00Z" },
        { status: "approved", timestamp: "2025-09-05T10:15:00Z" },
        { status: "assigned", timestamp: "2025-09-05T10:30:00Z" },
        { status: "in-transit", timestamp: "2025-09-05T11:00:00Z" }
      ]
    },
    {
      id: "ORD002",
      customerId: "CUST002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com", 
      items: ["Books", "Stationery"],
      totalWeight: 1.2,
      pickupAddress: "Warehouse B, Mumbai",
      deliveryAddress: "Andheri East, Mumbai",
      status: "pending",
      assignedDrone: null,
      estimatedDelivery: null,
      createdAt: "2025-09-05T11:30:00Z",
      statusHistory: [
        { status: "pending", timestamp: "2025-09-05T11:30:00Z" }
      ]
    },
    {
      id: "ORD003",
      customerId: "CUST001",
      customerName: "John Doe", 
      customerEmail: "john@example.com",
      items: ["Headphones"],
      totalWeight: 0.8,
      pickupAddress: "Warehouse A, Mumbai",
      deliveryAddress: "Powai, Mumbai", 
      status: "delivered",
      assignedDrone: "DRONE001",
      estimatedDelivery: "2025-09-04T16:00:00Z",
      createdAt: "2025-09-04T12:00:00Z",
      statusHistory: [
        { status: "pending", timestamp: "2025-09-04T12:00:00Z" },
        { status: "approved", timestamp: "2025-09-04T12:10:00Z" },
        { status: "assigned", timestamp: "2025-09-04T12:20:00Z" },
        { status: "in-transit", timestamp: "2025-09-04T13:00:00Z" },
        { status: "delivered", timestamp: "2025-09-04T15:45:00Z" }
      ]
    }
  ],
  users: [
    {
      id: "USR001",
      email: "admin@droneflux.com",
      password: "$2b$10$bNGc2Em8LsXw7vxk5UEoeufeT6WYA0OAZm8HtPRzM3oO0ijAOvAi2",
      role: "admin",
      name: "Admin User"
    },
    {
      id: "CUST001",
      email: "customer@example.com",
      password: "$2b$10$Pa.WTjGhxvgqmcfySCQ4qeVFSTtGGUX9dPBH2TNgEdxmNqUgQej8a",
      role: "customer",
      name: "John Doe",
      phone: "+91 9876543210",
      address: "Bandra West, Mumbai"
    },
    {
      id: "CUST002",
      email: "jane@example.com",
      password: "$2b$10$Pa.WTjGhxvgqmcfySCQ4qeVFSTtGGUX9dPBH2TNgEdxmNqUgQej8a",
      role: "customer",
      name: "Jane Smith",
      phone: "+91 9876543211",
      address: "Andheri East, Mumbai"
    }
  ]
};

// In-memory storage (replace with database in production)
export let appData = JSON.parse(JSON.stringify(mockData));