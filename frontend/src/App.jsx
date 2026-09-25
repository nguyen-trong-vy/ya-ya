//ref(00->13)
//feat/ho-so-va-lich-su-don(08)
//feat/heroslide(09)
//feat/blog-va-tin-tuc(10)
//feat/footer(11)
//feat/admin-dashboard(12)
//feat/quan-ly-don-hang(13)
//feat/quan-ly-banh-danh-sach(14)
//feat/quan-ly-banh-them-moi(15)

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HeroSlider from './components/HeroSlider';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import BlogSection from './components/BlogSection';
import ProductModal from './components/ProductModal';
import CategoryPage from './pages/Client/CategoryPage';
import CheckoutPage from './pages/Client/CheckoutPage';
import OrderSuccessPage from './pages/Client/OrderSuccessPage';
import ProfilePage from './pages/Client/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderManagePage from './pages/Admin/OrderManagePage';
import ProductManagePage from './pages/Admin/ProductManagePage';


// Điều hướng Trang chủ: Khách xem giao diện bán bánh, Admin chuyển thẳng vào Dashboard
function HomeRoute({ selectedProduct, setSelectedProduct }) {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return (
    <div>
      {/* Khối 1: Hero Banner Slider & Ticker Marquee */}
      <HeroSlider />

      {/* Khối 2: Danh mục sản phẩm */}
      <CategorySection />

      {/* Khối 3: Sản phẩm nổi bật */}
      <FeaturedProducts onQuickView={(p) => setSelectedProduct(p)} />

      {/* Khối 4: Blog & Tin tức ưu đãi lễ hội */}
      <BlogSection />

      {/* Modal xem nhanh sản phẩm khi xem danh mục/nổi bật */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

// Chân trang toàn cục: Ẩn đối với Quản trị viên
function AppFooter() {
  const { user } = useAuth();
  if (user?.role === 'admin') return null;
  return <Footer />;
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FBF7F4' }}>
            {/* Thanh điều hướng Header toàn cục có giỏ hàng */}
            <Header />

            {/* Khay giỏ hàng trượt sang từ mép phải */}
            <CartDrawer />

            <main style={{ flex: 1 }}>
              <Routes>
                {/* Trang chủ - Điều hướng thông minh theo role */}
                <Route
                  path="/"
                  element={
                    <HomeRoute
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                    />
                  }
                />

                {/* Trang danh mục sản phẩm chi tiết có Tabs lọc & Sắp xếp */}
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />

                {/* Tuyến đường Đặt hàng & Thanh toán (Yêu cầu đăng nhập) - feat/dat-hang(07) */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                {/* Trang đặt bánh thành công - feat/dat-hang(07) */}
                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />

                {/* Hồ sơ cá nhân & Lịch sử đơn hàng (Yêu cầu đăng nhập) - feat/ho-so-va-lich-su-don(08) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Phân hệ Quản trị Admin (Yêu cầu quyền Admin) - feat/admin-dashboard(12) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Quản lý đơn hàng & xác nhận tiền mặt (Yêu cầu quyền Admin) - feat/quan-ly-don-hang(13) */}
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <OrderManagePage />
                    </ProtectedRoute>
                  }
                />

                {/* Quản lý thực đơn bánh (Yêu cầu quyền Admin) - feat/quan-ly-banh-danh-sach(14) */}
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ProductManagePage />
                    </ProtectedRoute>
                  }
                />

                {/* Luồng xác thực người dùng (Auth Flow từ Commit 01 - 03) */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Tuyến đường mặc định */}
                <Route
                  path="*"
                  element={
                    <HomeRoute
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                    />
                  }
                />
              </Routes>
            </main>

            {/* Chân trang toàn cục Yuu Cake (chỉ hiện cho khách, ẩn đối với admin) */}
            <AppFooter />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}