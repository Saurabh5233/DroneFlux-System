import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/pages/Home';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="object-cover w-full h-48"
        />
        {product.is_featured && (
          <Badge className="absolute top-2 right-2">Featured</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold">
            {product.sale_price ? (
              <>
                <span className="text-red-500">${product.sale_price}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              `$${product.price}`
            )}
          </p>
          <Button onClick={() => addToCart(product)}>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}
