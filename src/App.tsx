import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Feed } from './pages/Feed';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Insights } from './pages/Insights';
import { AdminProductManager } from './pages/AdminProductManager';
import { AdminArticleManager } from './pages/AdminArticleManager';
import { AdminOrderManager } from './pages/AdminOrderManager';
import { AdminCustomerManager } from './pages/AdminCustomerManager';
import { Orders } from './pages/Orders';
import { SellerOnboarding } from './pages/SellerOnboarding';
import { SellerDashboard } from './pages/SellerDashboard';
import { Shops } from './pages/Shops';
import { Chat } from './pages/Chat';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseProvider } from './context/FirebaseContext';

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/feed" element={<PageWrapper><Feed /></PageWrapper>} />
                <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
                <Route path="/insights" element={<PageWrapper><Insights /></PageWrapper>} />
                <Route path="/shops" element={<PageWrapper><Shops /></PageWrapper>} />
                <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
                <Route path="/chat/:chatId" element={<PageWrapper><Chat /></PageWrapper>} />
                <Route path="/seller/onboarding" element={<PageWrapper><SellerOnboarding /></PageWrapper>} />
                <Route path="/seller/dashboard" element={<PageWrapper><SellerDashboard /></PageWrapper>} />
                <Route path="/admin" element={<PageWrapper><AdminProductManager /></PageWrapper>} />
                <Route path="/admin/articles" element={<PageWrapper><AdminArticleManager /></PageWrapper>} />
                <Route path="/admin/orders" element={<PageWrapper><AdminOrderManager /></PageWrapper>} />
                <Route path="/admin/customers" element={<PageWrapper><AdminCustomerManager /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </FirebaseProvider>
  );
}

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);
