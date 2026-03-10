import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import { CheckoutForm } from './components/CheckoutForm';
import { CartProvider } from './contexts/CartContext';
import { CartBadge } from './components/CartBadge';
import './App.css';

function CheckoutPage() {
    const navigate = useNavigate();
    return <CheckoutForm onOrderPlaced={() => navigate('/')} />;
}

function App() {
    return (
        <CartProvider>
        <BrowserRouter>
            <div className="app">
                {/* Cart icon fixed to top-right */}
                <div style={{ position: 'fixed', top: '16px', right: '20px', zIndex: 1000 }}>
                    <Link to="/cart" aria-label="Go to cart">
                        <CartBadge />
                    </Link>
                </div>

                {/* --- NEW PROFESSIONAL HEADER SECTION --- */}
                <header style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '50px 0',
                    textAlign: 'center',
                    backgroundColor: 'transparent' // Let your index.css background show through
                }}>
                    <div style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '15px 50px',
                        borderTop: '5px solid #bb0000',    /* Heavy Scarlet Top */
                        borderBottom: '5px solid #bb0000', /* Heavy Scarlet Bottom */
                        transition: 'all 0.3s ease'
                    }}>
                        <h1 style={{ 
                            margin: '0', 
                            fontSize: '3.5rem', 
                            fontWeight: '900', 
                            color: '#bb0000', 
                            letterSpacing: '6px',
                            textTransform: 'uppercase',
                            lineHeight: '1',
                            textAlign: 'center'
                        }}>
                            Buckeye Marketplace
                        </h1>
                    </div>
                    <div style={{ 
                        marginTop: '15px', 
                        color: '#666', 
                        letterSpacing: '2px', 
                        fontSize: '0.9rem',
                        fontWeight: 'bold', 
                        textAlign: 'center'
                    }}>
                        COLUMBUS, OHIO • THE OHIO STATE UNIVERSITY
                    </div>
                </header>
                {/* --------------------------------------- */}

                <Routes>
                    <Route path="/" element={<ProductListPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
            </div>
        </BrowserRouter>
        </CartProvider>
    );
}

export default App;