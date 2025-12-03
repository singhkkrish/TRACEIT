import React, { useState } from 'react';
import { Mail, Lock, User, MailCheck } from 'lucide-react';

const Register = ({ onNavigate, onAuthChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Registration successful:', data.user);
        
        // Trigger auth update in App.jsx to refresh Header
        if (onAuthChange) {
          onAuthChange();
        }
        
        // Navigate to home page
        onNavigate('home');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10 mt-4"> 
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <MailCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-500">
            Start reuniting lost items today. It's fast and secure.
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleRegistration} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password (min 8 characters)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input 
                id="terms" 
                type="checkbox" 
                required
                className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black/50"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                I agree to the <a href="#" className="text-black font-medium hover:underline">Terms of Service</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
          
          {/* Switch to Sign In */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')}
              className="font-bold text-black hover:text-gray-700 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;