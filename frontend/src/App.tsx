import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import { CheckoutForm } from './components/CheckoutForm';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { CartBadge } from './components/CartBadge';
import type { Order } from './types/order';
import './App.css';

function CheckoutPage() {
    const navigate = useNavigate();
    return <CheckoutForm onOrderPlaced={(order: Order) => navigate('/orders/confirmation', { state: { order } })} />;
}

function AppHeader() {
    const { isAuthenticated, session, logout, isAdmin } = useAuthContext();

    return (
        <>
            <div className="topBar">
                <div className="authNav" aria-label="Authentication navigation">
                    {isAuthenticated ? (
                        <>
                            <span className="userChip">
                                {session?.user.email}
                                {isAdmin ? ' (Admin)' : ''}
                            </span>
                            <button className="logoutButton" onClick={logout} aria-label="Logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="authLink" aria-label="Go to login page">
                                Login
                            </Link>
                            <Link to="/register" className="authLink" aria-label="Go to registration page">
                                Register
                            </Link>
                        </>
                    )}
                </div>
                <Link to="/cart" aria-label="Go to cart">
                    <CartBadge />
                </Link>
            </div>

            <header style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '50px 0',
                textAlign: 'center',
                backgroundColor: 'transparent'
            }}>
                <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px 50px',
                    borderTop: '5px solid #bb0000',
                    borderBottom: '5px solid #bb0000',
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
        </>
    );
}

function AppLayout() {
    return (
        <div className="app">
            <AppHeader />

            <Routes>
                <Route path="/" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/orders/confirmation"
                    element={(
                        <ProtectedRoute>
                            <OrderConfirmationPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/cart"
                    element={(
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/checkout"
                    element={(
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    )}
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <AppLayout />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;