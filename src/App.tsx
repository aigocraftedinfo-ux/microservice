import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function AppContent() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [checkoutAddress, setCheckoutAddress] = useState<any>(null);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    handleNavigate('products');
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    handleNavigate('product-details');
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    handleNavigate('products');
  };

  const handleProceedToPayment = (address: any) => {
    setCheckoutAddress(address);
    handleNavigate('payment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans antialiased text-gray-900">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onSelectCategory={handleSelectCategory}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activePage === 'products' && (
          <ProductsPage
            initialSearchQuery={searchQuery}
            initialCategory={selectedCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'product-details' && (
          <ProductDetailsPage productId={selectedProductId} onNavigate={handleNavigate} />
        )}

        {activePage === 'cart' && (
          <CartPage onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage onProceedToPayment={handleProceedToPayment} onNavigate={handleNavigate} />
        )}

        {activePage === 'payment' && (
          <PaymentPage shippingAddress={checkoutAddress} onNavigate={handleNavigate} />
        )}

        {activePage === 'orders' && <OrdersPage onNavigate={handleNavigate} />}

        {activePage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}

        {activePage === 'admin' && <AdminDashboardPage />}

        {activePage === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {activePage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
