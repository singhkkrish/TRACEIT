import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Type, X, CheckCircle, LogIn } from 'lucide-react';

const LostItem = ({ onNavigate, onAuthRequired, initialFormData, onClearPendingData }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    locationLost: '',
    dateLost: '',
    photos: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Restore form data if user returns after login
  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
      if (initialFormData.photos && initialFormData.photos.length > 0) {
        setImagePreview(initialFormData.photos[0]);
      }
      // Clear pending data after restoration
      if (onClearPendingData) {
        onClearPendingData();
      }
    }
  }, [initialFormData, onClearPendingData]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({
          ...formData,
          photos: [base64String]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      photos: []
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.itemName || !formData.category || !formData.locationLost || !formData.dateLost) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show auth required modal
      setShowAuthModal(true);
      return;
    }

    // User is logged in, proceed with submission
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/items/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          itemName: '',
          category: '',
          locationLost: '',
          dateLost: '',
          photos: []
        });
        setImagePreview(null);

        setTimeout(() => {
          setShowSuccessModal(false);
          onNavigate('home');
        }, 3000);
      } else {
        setError(data.message || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle login redirect with form data preservation
  const handleLoginRedirect = () => {
    setShowAuthModal(false);
    if (onAuthRequired) {
      onAuthRequired(formData, 'lost-item');
    }
  };

  // Handle register redirect with form data preservation
  const handleRegisterRedirect = () => {
    setShowAuthModal(false);
    if (onAuthRequired) {
      onAuthRequired(formData, 'lost-item');
    }
    onNavigate('register');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Report a Lost Item</h1>
          <p className="text-gray-500">
            Provide as much detail as possible to help us reunite you with your item.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Item Details */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-gray-400" /> Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 13 Pro, Blue Wallet" 
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Wallet/Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Documents">Documents</option>
                    <option value="Keys">Keys</option>
                    <option value="Bags">Bags</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Date */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" /> Location & Date
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Where was it lost? <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="locationLost"
                    value={formData.locationLost}
                    onChange={handleChange}
                    placeholder="e.g. Central Park, Coffee Shop" 
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date Lost <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    name="dateLost"
                    value={formData.dateLost}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Image Upload */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-400" /> Photos (Optional)
              </h3>
              
              {!imagePreview ? (
                <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer block">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={() => onNavigate('home')}
                disabled={loading}
                className="flex-1 py-4 border border-gray-200 text-black font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in or create an account to submit your report. Don't worry, your form data will be saved!
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegisterRedirect}
                  className="w-full py-3 border-2 border-black text-black font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-3 text-gray-600 hover:text-black font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Report Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your lost item report has been saved. We'll notify you if we find a match.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <span>Redirecting to home page...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LostItem;