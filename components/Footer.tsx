import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-6 text-center text-sm text-theme-text-muted bg-theme-bg-primary border-t border-theme-border">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="#" className="hover:text-theme-text-base">About Us</a>
        <a href="#" className="hover:text-theme-text-base">Contact</a>
        <a href="#" className="hover:text-theme-text-base">Shipping & Returns</a>
        <a href="#" className="hover:text-theme-text-base">FAQ</a>
      </div>
      © {new Date().getFullYear()} OneDering Shoes. All rights reserved.
    </footer>
  );
};

export default Footer;
