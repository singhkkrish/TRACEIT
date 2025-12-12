import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Type, ShieldQuestion, X, CheckCircle, LogIn, Phone } from 'lucide-react';

const FoundItem = ({ onNavigate, onAuthRequired, initialFormData, onClearPendingData }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    locationFound: '',
    dateFound: '',
    phone: '',
    securityQuestion: '',
    securityAnswer: '',
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
      if (onClearPendingData) {
        onClearPendingData();
      }
    }
  }, [initialFormData, onClearPendingData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

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
        setError(''); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      photos: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields including photo
    if (!formData.itemName || !formData.category || !formData.locationFound || 
        !formData.dateFound || !formData.securityQuestion || !formData.securityAnswer) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if image is uploaded
    if (!formData.photos || formData.photos.length === 0) {
      setError('Please upload a photo of the item');
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/found-items/report', {
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
        
        setFormData({
          itemName: '',
          category: '',
          locationFound: '',
          dateFound: '',
          phone: '',
          securityQuestion: '',
          securityAnswer: '',
          photos: []
        });
        setImagePreview(null);

        setTimeout(() => {
          setShowSuccessModal(false);
          onNavigate('browse-items');
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

  const handleLoginRedirect = () => {
    setShowAuthModal(false);
    if (onAuthRequired) {
      onAuthRequired(formData, 'found-item');
    }
  };

  const handleRegisterRedirect = () => {
    setShowAuthModal(false);
    if (onAuthRequired) {
      onAuthRequired(formData, 'found-item');
    }
    onNavigate('register');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Report a Found Item</h1>
          <p className="text-gray-500">
            Help us return this item to its rightful owner. Please provide accurate details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Item Details */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-teal-600" /> Basic Information
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
                    placeholder="e.g. Black Leather Wallet" 
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
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
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
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
                <MapPin className="w-5 h-5 text-teal-600" /> Location & Date
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Where was it found? <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="locationFound"
                    value={formData.locationFound}
                    onChange={handleChange}
                    placeholder="e.g. Main Street Bus Stop" 
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date Found <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Information */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal-600" /> Contact Information
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210" 
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <p className="text-xs text-teal-600">
                  💡 Providing a phone number helps the owner contact you faster
                </p>
              </div>
            </div>

            {/* Section 4: Verification Question */}
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-teal-800">
                <ShieldQuestion className="w-5 h-5" /> Security Question
              </h3>
              <p className="text-sm text-teal-600 mb-4">
                Set a question that only the owner would know (e.g., "What is the wallpaper image?" or "How much cash is inside?").
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Question <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    placeholder="e.g. What is the name on the ID card inside?" 
                    required
                    className="w-full p-3 bg-white rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    placeholder="Your answer (case-insensitive)" 
                    required
                    className="w-full p-3 bg-white rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                  <p className="text-xs text-teal-600">
                    💡 This will be used to verify the rightful owner
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Image Upload - NOW REQUIRED */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" /> 
                Photos <span className="text-red-500">*</span>
              </h3>
              
              {!imagePreview ? (
                <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group block">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Click to upload image</p>
                  <p className="text-xs text-red-600 font-medium mb-1">⚠️ Photo is required</p>
                  <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Photo uploaded
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
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
                className="flex-1 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-teal-600" />
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
                Thank you for helping reunite lost items with their owners. Your report has been saved.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
                <span>Redirecting to browse page...</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default FoundItem;