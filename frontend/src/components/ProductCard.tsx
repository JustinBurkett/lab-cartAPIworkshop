import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div 
        style={{
          backgroundColor: '#ffffff', // Explicitly white card background
          border: '1px solid #ddd',   // Softer border
          borderRadius: '12px',
          padding: '0',               // Reset padding to let image touch edges
          overflow: 'hidden',         // Clips the image to the border radius
          cursor: 'pointer',
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
        {/* 1. Added the Image Section */}
        <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0' }}>
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* 2. Text Section with updated colors */}
        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#212121' }}>{product.title}</h3>
          
          <p style={{ margin: '4px 0', color: '#bb0000', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ${product.price.toFixed(2)}
          </p>
          
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            <p style={{ margin: '2px 0' }}><strong>Category:</strong> {product.category}</p>
            <p style={{ margin: '2px 0' }}><strong>Seller:</strong> {product.sellerName}</p>
          </div>

        </div>
      </div>
    </Link>
  );
};