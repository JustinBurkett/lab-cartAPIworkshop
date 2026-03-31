import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = product.stockQuantity < 1;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#bb0000';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#ddd';
      }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0' }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#212121' }}>{product.title}</h3>

          <p style={{ margin: '4px 0', color: '#bb0000', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ${product.price.toFixed(2)}
          </p>

          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            <p style={{ margin: '2px 0' }}><strong>Category:</strong> {product.category}</p>
            <p style={{ margin: '2px 0' }}><strong>Seller:</strong> {product.sellerName}</p>
            <p style={{ margin: '2px 0', color: isOutOfStock ? '#b00020' : '#2e7d32' }}>
              <strong>Availability:</strong> {isOutOfStock ? 'Out of stock' : `In stock (${product.stockQuantity})`}
            </p>
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 16px 16px' }}>
        <AddToCartButton
          product={{
            id: product.id,
            name: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
          }}
          disabled={isOutOfStock}
        />
      </div>
    </div>
  );
};