import React, { useState } from 'react';
import { MapPin, Calendar, Tag, User, Mail, Phone, FileText, X, Lock, CheckCircle, AlertCircle } from "lucide-react";

const ItemDetailModal = ({ item, isOpen, onClose, type }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!item || !isOpen) return null;

  // Format date properly
  const formattedDate = (() => {
    const d = new Date(item.date);
    if (isNaN(d)) return item.date || '';
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  })();

  // Get contact info based on item type
  const contactName = type === 'lost' 
    ? item.reportedBy?.name || 'N/A'
    : item.foundBy?.name || 'N/A';
  
  const contactEmail = type === 'lost'
    ? item.reportedBy?.email || 'N/A'
    : item.foundBy?.email || 'N/A';

  // Get phone from item itself or from user profile
  const contactPhone = type === 'lost'
    ? (item.phone || item.reportedBy?.phone || 'Not provided')
    : (item.phone || item.foundBy?.phone || 'Not provided');

  // Get security question for found items
  const securityQuestion = item.securityQuestion || item.description;

  // Handle claim button click for found items
  const handleClaimClick = () => {
    if (type === 'found' && !isVerified) {
      setShowVerification(true);
    }
  };

  // Handle verification submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setLoading(true);

    try {
      const response = await fetch(`https://traceit-backend.onrender.com/api/found-items/${item.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          securityAnswer: verificationAnswer
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        setShowVerification(false);
        setVerificationError('');
      } else {
        setVerificationError(data.message || 'Incorrect answer. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('Unable to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close modal and reset states
  const handleClose = () => {
    setShowVerification(false);
    setVerificationAnswer('');
    setIsVerified(false);
    setVerificationError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Image Section */}
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-64 object-cover"
          />
          <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {item.status === 'active' ? 'Active' : 'Claimed'}
          </span>
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4" />
              <span>{item.category}</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description - Show for lost items */}
            {item.description && type === 'lost' && (
              <>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <hr className="border-gray-200" />
              </>
            )}

            {/* Security Question - Show for found items (before verification) */}
            {type === 'found' && !isVerified && securityQuestion && (
              <>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Security Question
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {securityQuestion}
                  </p>
                </div>
                <hr className="border-gray-200" />
              </>
            )}

            {/* Location & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location {type === 'lost' ? 'Lost' : 'Found'}
                </h4>
                <p className="text-gray-600">{item.location}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date {type === 'lost' ? 'Lost' : 'Found'}
                </h4>
                <p className="text-gray-600">{formattedDate}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Contact Information - Show for lost items OR verified found items */}
            {(type === 'lost' || (type === 'found' && isVerified)) && (
              <>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                    Contact Information
                  </h4>
                  {isVerified && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ Verification successful! You can now contact the finder.
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white rounded-full p-2">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{contactName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white rounded-full p-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </div>
                      <a 
                        href={`mailto:${contactEmail}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {contactEmail}
                      </a>
                    </div>
                    {contactPhone !== 'Not provided' && (
                      <div className="flex items-center gap-3">
                        <div className="bg-white rounded-full p-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <a 
                          href={`tel:${contactPhone}`}
                          className="text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <hr className="border-gray-200" />
              </>
            )}

            {/* Verification Form - Show only for found items when claiming */}
            {type === 'found' && showVerification && !isVerified && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Verify Your Ownership
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Please answer the security question to prove this item belongs to you.
                </p>
                <form onSubmit={handleVerificationSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      value={verificationAnswer}
                      onChange={(e) => setVerificationAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {verificationError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800 text-sm">{verificationError}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading || !verificationAnswer.trim()}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying...' : 'Verify & View Contact'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setVerificationError('');
                        setVerificationAnswer('');
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Action Buttons */}
            {!showVerification && (
              <div className="flex gap-3 pt-2">
                {type === 'found' && item.status === 'active' && !isVerified && (
                  <button 
                    onClick={handleClaimClick}
                    className="flex-1 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Claim This Item
                  </button>
                )}
                <button 
                  onClick={handleClose}
                  className={`${type === 'found' && !isVerified ? 'flex-1' : 'w-full'} py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ItemDetailModal;
