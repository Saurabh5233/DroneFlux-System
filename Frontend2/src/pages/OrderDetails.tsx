import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p>Order ID: {id}</p>
    </div>
  );
};

export default OrderDetails;