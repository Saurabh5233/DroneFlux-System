import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import GoogleCallback from "./pages/GoogleCallback";
import Cart from "./pages/Cart";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/confirmation/:orderId" element={<Confirmation />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
