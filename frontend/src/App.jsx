//feat/cau-hinh-nen-tang(00)

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';


// Component trang Demo để kiểm tra đăng nhập thành công
function DashboardDemo() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Chào mừng bạn đã đăng nhập thành công!</h1>
      <p>Đây là trang được bảo vệ bởi ProtectedRoute.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Tuyến đường công khai */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          




          {/* Tuyến đường bảo vệ mẫu */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardDemo />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
