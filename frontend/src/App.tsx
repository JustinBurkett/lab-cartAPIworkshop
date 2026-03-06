import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
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
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;