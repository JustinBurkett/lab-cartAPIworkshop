import { useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { ProductCard } from '../components/ProductCard';
import './productlist.css';

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    if (loading) return <h2>Loading Buckeye Gear...</h2>;
    if (products.length === 0) return <h2>No products found. Go Bucks?</h2>;

    return (
        <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
    );
};

export default ProductListPage;