import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';

export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  image_url: string;
  is_featured: boolean;
  brand: string;
  category: string;
  rating: number;
  review_count: number;
  stock_quantity: number;
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 349.99,
    sale_price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    is_featured: true,
    brand: 'Sony',
    category: 'Electronics',
    rating: 4.8,
    review_count: 1245,
    stock_quantity: 50,
  },
  {
    id: '2',
    name: 'Smartwatch with GPS and Heart Rate Monitor',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
    is_featured: true,
    brand: 'Apple',
    category: 'Electronics',
    rating: 4.9,
    review_count: 2345,
    stock_quantity: 100,
  },
  {
    id: '3',
    name: 'Professional DSLR Camera with 24-105mm Lens',
    price: 1299.99,
    image_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600',
    is_featured: true,
    brand: 'Canon',
    category: 'Electronics',
    rating: 4.7,
    review_count: 876,
    stock_quantity: 20,
  },
  {
    id: '4',
    name: 'Lightweight Running Shoes',
    price: 120.00,
    sale_price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    is_featured: true,
    brand: 'Nike',
    category: 'Clothing',
    rating: 4.6,
    review_count: 543,
    stock_quantity: 200,
  },
];

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your payment information is always protected'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy on all items'
    },
    {
      icon: Star,
      title: 'Quality Products',
      description: 'Curated selection of premium items'
    }
  ];

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300', count: '2,345' },
    { name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300', count: '1,876' },
    { name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', count: '987' },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', count: '654' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="text-sm font-medium">New Collection Available</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover Amazing{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Products
                  </span>{' '}
                  at Great Prices
                </h1>
                <p className="text-xl text-muted-foreground">
                  Shop the latest trends with unbeatable deals. Quality products, 
                  fast shipping, and excellent customer service guaranteed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary" asChild>
                  <Link to="/products">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" 
                  alt="Shopping Experience"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Discover products in your favorite categories</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} items</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked items just for you</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ShopFlux?</h2>
            <p className="text-muted-foreground">Experience the best in online shopping</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Latest Deals
            </h2>
            <p className="text-white/90 mb-8">
              Subscribe to our newsletter and be the first to know about exclusive offers, new arrivals, and special promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <Button className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
