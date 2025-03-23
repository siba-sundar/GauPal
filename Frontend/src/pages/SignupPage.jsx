import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    userType: 'buyer' // Default to buyer
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Get ID token for API request
      const idToken = await userCredential.user.getIdToken();
      
      // Register user in your backend
      const response = await axios.post('http://localhost:5000/gaupal/auth/signup', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        userType: formData.userType
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
      // Create a user object similar to what the login endpoint returns
      const user = {
        uid: userCredential.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        userType: formData.userType,
        isVerified: false
      };
      
      // Store complete user object in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on user type
      if (formData.userType === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password with at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setError('The email address is not valid. Please check and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } 
      // Handle backend API errors
      else if (error.response) {
        if (error.response.status === 409) {
          setError('User with this email already exists in our system.');
        } else if (error.response.status === 400 && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred while registering your account. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again or contact support if the problem persists.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Account Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="buyer"
                  checked={formData.userType === 'buyer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Buyer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="farmer"
                  checked={formData.userType === 'farmer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Farmer
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;