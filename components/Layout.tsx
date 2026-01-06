
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-2xl mb-8 flex flex-col items-center border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-bold tracking-widest text-[#D4AF37] uppercase mb-2">DIAGEO</h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase font-medium">Whisky Ambassadeur Portaal</p>
      </header>
      <main className="w-full max-w-2xl flex-grow">
        {children}
      </main>
      <footer className="mt-12 text-gray-600 text-xs text-center py-4">
        &copy; {new Date().getFullYear()} Diageo Whisky Ambassadeur Tools. Geniet, maar drink met mate.
      </footer>
    </div>
  );
};

export default Layout;
