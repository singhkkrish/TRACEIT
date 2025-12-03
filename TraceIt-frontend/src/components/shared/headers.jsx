import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, FileText } from 'lucide-react';
import money from "../../assets/money.png"

const Header = ({ onNavigate, currentPage, authUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is logged in on component mount and when authUpdate changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [authUpdate]); // Re-run when authUpdate changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    
    // Navigate to home
    onNavigate('home');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Navigation */}
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')} 
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('lost-item')} 
              className={`text-sm font-medium transition-colors ${
                currentPage === 'lost-item' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Lost Item
            </button>
            <button 
              onClick={() => onNavigate('found-item')} 
              className={`text-sm font-medium transition-colors ${
                currentPage === 'found-item' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Found Item
            </button>
            <button 
              onClick={() => onNavigate('browse-items')} 
              className={`text-sm font-medium transition-colors ${
                currentPage === 'browse-items' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Browse
            </button>
          </nav>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={money} alt="TraceIt logo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold tracking-wider">TRACEIT</span>
            </button>
          </div>

          {/* Right: Auth Buttons or Avatar */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              // Avatar with Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer ring-2 ring-gray-200"
                  title={user?.name || 'User'}
                >
                  {getInitials(user?.name)}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onNavigate('my-reports');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        My Reports
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;