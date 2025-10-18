import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Blocks, 
  DoorOpen, 
  QrCode,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Hotels', href: '/hotels', icon: Building2 },
    // { name: 'Blocks', href: '/blocks', icon: Blocks },
    // { name: 'Rooms', href: '/rooms', icon: DoorOpen },
    { name: 'QR Management', href: '/qr-management', icon: QrCode },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'w-64 translate-x-0 animate-slideIn' : '-translate-x-full'}
          lg:translate-x-0 lg:z-auto lg:sticky lg:top-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Hotel QR </h1>
                <p className="text-xs text-blue-200">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-700">
            <div className="text-xs text-blue-200 text-center">
              <p>© 2025 TownHall Present</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;

