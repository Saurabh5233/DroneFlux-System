import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ordersAPI } from "../services/ordersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Confirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersAPI.getById(orderId);
        setOrder(response.data.order);
      } catch (err) {
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Order Confirmed!</CardTitle>
          <p className="text-lg text-muted-foreground">Thank you for your purchase.</p>
        </CardHeader>
        <CardContent>
          {order && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Order ID</p>
                <p className="text-muted-foreground">{order._id}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">Status</p>
                <Badge>{order.status}</Badge>
              </div>
              <div>
                <p className="font-semibold mb-2">Items</p>
                <ul className="list-disc list-inside pl-4 text-muted-foreground">
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Weight</p>
                <p>{order.totalWeight} kg</p>
              </div>
              <div>
                <p className="font-semibold">Delivery Address</p>
                <p className="text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/" className="text-primary underline">
              Continue Shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
