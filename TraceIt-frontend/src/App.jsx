import React, { useState } from 'react';
import Header from './components/shared/headers.jsx';
import Home from './pages/home.jsx';
import LostItem from './pages/lost-item.jsx';
import FoundItem from './pages/found-item.jsx';
import BrowseItems from './pages/browse-items.jsx';
import Register from './components/auth/register.jsx';
import Login from './components/auth/login.jsx'; 

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authUpdate, setAuthUpdate] = useState(0);
  
  // Store pending form data and redirect page
  const [pendingFormData, setPendingFormData] = useState(null);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
    
    const url = new URL(window.location);
    url.hash = ''; 
    window.history.pushState({}, '', url);
  };

  // Function to trigger Header update after login/logout
  const handleAuthChange = () => {
    setAuthUpdate(prev => prev + 1);
    
    // After successful login/register, redirect to pending page with form data
    if (redirectAfterAuth) {
      setTimeout(() => {
        navigateTo(redirectAfterAuth);
        setRedirectAfterAuth(null);
      }, 100);
    }
  };

  // Save form data before redirecting to login
  const handleAuthRequired = (formData, returnPage) => {
    setPendingFormData(formData);
    setRedirectAfterAuth(returnPage);
    navigateTo('login');
  };

  // Clear pending data
  const clearPendingData = () => {
    setPendingFormData(null);
    setRedirectAfterAuth(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Header 
        onNavigate={navigateTo} 
        currentPage={currentPage} 
        authUpdate={authUpdate} 
      />

      {currentPage === 'home' && (
        <Home onNavigate={navigateTo} />
      )}
      
      {currentPage === 'lost-item' && (
        <LostItem 
          onNavigate={navigateTo}
          onAuthRequired={handleAuthRequired}
          initialFormData={pendingFormData}
          onClearPendingData={clearPendingData}
        />
      )}

      {currentPage === 'found-item' && (
        <FoundItem 
          onNavigate={navigateTo}
          onAuthRequired={handleAuthRequired}
          initialFormData={pendingFormData}
          onClearPendingData={clearPendingData}
        />
      )}

      {currentPage === 'browse-items' && (
        <BrowseItems onNavigate={navigateTo} />
      )}
      
      {currentPage === 'register' && (
        <Register onNavigate={navigateTo} onAuthChange={handleAuthChange} />
      )}
      
      {currentPage === 'login' && (
        <Login onNavigate={navigateTo} onAuthChange={handleAuthChange} />
      )}
    </div>
  );
}

export default App;