import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  setActivePage: (page: 'home' | 'products' | 'cart' | 'productDetail' | 'wishlist') => void;
  activePage: 'home' | 'products' | 'cart' | 'productDetail' | 'wishlist';
}

const Layout: React.FC<LayoutProps> = ({ children, setActivePage, activePage }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  }

  const handlePageChange = (page: 'home' | 'products' | 'cart' | 'productDetail' | 'wishlist') => {
    setActivePage(page);
    closeMobileMenu();
  }


  return (
    <div className="flex flex-col h-screen bg-theme-bg-secondary text-theme-text-base overflow-hidden">
      <Header 
        toggleSidebar={toggleSidebar}
        toggleMobileMenu={toggleMobileMenu}
        setActivePage={setActivePage}
      />
      <div className="flex flex-1 overflow-hidden">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
        <Sidebar 
          setActivePage={handlePageChange} 
          activePage={activePage}
          isSidebarMinimized={isSidebarMinimized}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
