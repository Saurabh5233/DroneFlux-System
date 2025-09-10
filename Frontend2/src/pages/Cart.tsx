import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "@/services/api";

export default function Cart() {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState("Warehouse A, 123 Industrial Rd, Tech City");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleCheckout = async () => {
    if (!customerName || !customerEmail || !deliveryAddress) {
      alert("Please fill in all customer and delivery details.");
      return;
    }

    const orderData = {
      customerName,
      customerEmail,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
      })),
      totalWeight: cart.reduce((acc, item) => acc + (item.quantity * 0.5), 0), // Assuming 0.5kg per item
      pickupAddress,
      deliveryAddress,
    };

    console.log('Order data:', orderData);
    console.log('API Key:', import.meta.env.VITE_EXTERNAL_API_KEY);

    try {
      const response = await ordersAPI.createExternal(orderData, import.meta.env.VITE_EXTERNAL_API_KEY);
      
      console.log('Order creation response:', response.data);
      
      if (response.data.success) {
        const { order } = response.data;
        clearCart();
        navigate(`/confirmation/${order._id}`);
      } else {
        console.error("Failed to create order:", response.data.message);
        alert(`Failed to create order: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to create order: ${error.response.data.message || 'Server error'}`);
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.sale_price || item.price} x {item.quantity}
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="md:col-span-2"
                  />
                   <Input
                    placeholder="Pickup Address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="md:col-span-2"
                    disabled 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <p className="text-lg font-bold">Total: ${getCartTotal().toFixed(2)}</p>
                <Button onClick={handleCheckout} size="lg">Checkout</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}