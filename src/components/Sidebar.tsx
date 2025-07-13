import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { name: 'Tableau de bord', href: '/', icon: '📊' },
    { name: 'Plateformes', href: '/platforms', icon: '🌐' },
    { name: 'Services', href: '/services', icon: '⚙️' },
    { name: 'Types de services', href: '/service-types', icon: '🏷️' },
    { name: 'Commandes', href: '/orders', icon: '📦' },
    { name: 'Paiements', href: '/payments', icon: '💳' },
    { name: 'Tickets support', href: '/tickets', icon: '🎫' },
    { name: 'Administrateurs', href: '/admins', icon: '👥' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SBP</span>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              SocialBoost Pro
            </h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Logout logic will be implemented
              console.log('Logout clicked');
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="mr-3">🚪</span>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 