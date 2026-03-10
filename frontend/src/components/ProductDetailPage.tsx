import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { AddToCartButton } from './AddToCartButton';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:5000/api/products/${id}`) //CHANGE THIS TO ASYNC AND AWAIT
            .then(res => {
                if (!res.ok) throw new Error('Product not found');
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <h2>Loading product...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!product) return <h2>Product not found</h2>;

    return (
    <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Centers the whole container
    }}>
        {/* Back Button - Aligned to the left of the content area */}
        <div style={{ width: '100%', maxWidth: '900px', marginBottom: '20px' }}>
            <button 
                onClick={() => navigate('/')}
                style={{ background: 'none', color: '#666', border: '1px solid #ccc', padding: '8px 16px' }}
            >
                ← Back to Products
            </button>
        </div>

        {/* The White "Detail Card" */}
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '60px', 
            backgroundColor: '#fff', 
            padding: '50px', 
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '900px',
            width: '100%',
            alignItems: 'flex-start' // Keeps text at the top
        }}>
            
            {/* Left Side: Image */}
            <div style={{ flex: '1' }}>
                <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                />
            </div>

            {/* Right Side: Info */}
            <div style={{ flex: '1.2', textAlign: 'left' }}>
                <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#212121' }}>
                    {product.title}
                </h2>
                
                <p style={{ color: '#bb0000', fontSize: '2rem', fontWeight: 'bold', margin: '15px 0' }}>
                    ${product.price.toFixed(2)}
                </p>

                <p style={{ lineHeight: '1.6', color: '#444', fontSize: '1.1rem', marginBottom: '30px' }}>
                    {product.description}
                </p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', color: '#666' }}>
                    <p style={{ margin: '5px 0' }}><strong>Category:</strong> {product.category}</p>
                    <p style={{ margin: '5px 0' }}><strong>Seller:</strong> {product.sellerName}</p>
                    <p style={{ margin: '5px 0' }}><strong>Posted:</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <AddToCartButton
                        product={{
                            id: product.id,
                            name: product.title,
                            price: product.price,
                            imageUrl: product.imageUrl,
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
);};

export default ProductDetailPage;
