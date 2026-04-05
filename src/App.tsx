import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Insights } from './pages/Insights';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/collection" element={<PageWrapper><Collection /></PageWrapper>} />
              <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/insights" element={<PageWrapper><Insights /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
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
