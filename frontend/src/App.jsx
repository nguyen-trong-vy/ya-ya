//04
//05
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import FeaturedProducts from './components/FeaturedProducts';
import ProductModal from './components/ProductModal';
import CategorySection from './components/CategorySection';
import CategoryPage from './pages/Client/CategoryPage';
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <main style={{ minHeight: '100vh', backgroundColor: '#FBF7F4' }}>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                      <CategorySection />
                    <FeaturedProducts onQuickView={(p) => setSelectedProduct(p)} />
                    {selectedProduct && (
                      <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                      />
                    )}
                  </div>
                }
              />
               <Route path="/categories" element={<CategoryPage />} />
              <Route path="/categories/:slug" element={<CategoryPage /
              >} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}