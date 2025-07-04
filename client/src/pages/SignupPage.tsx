import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      if (result.error) {
        setErrors({ general: result.error });
      } else {
        // Show success message and redirect
        alert('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-[#00B4D8] hover:text-[#48CAE4] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-gray-900 border-[#00B4D8] shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src="/drone.png" alt="MediCart" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#48CAE4]">
              Create Account
            </CardTitle>
            <p className="text-gray-400">
              Join MediCart for the best healthcare experience
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-[#CAF0F8]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-[#00B4D8]'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm">{errors.fullName}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#CAF0F8]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${
                      errors.email ? 'border-red-500' : 'border-[#00B4D8]'
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#CAF0F8]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${
                      errors.password ? 'border-red-500' : 'border-[#00B4D8]'
                    }`}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00B4D8] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
                <div className="text-xs text-gray-400">
                  Password must be at least 6 characters with uppercase, lowercase, and number
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#CAF0F8]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[#00B4D8]'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00B4D8] transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 text-[#00B4D8] focus:ring-[#00B4D8] bg-gray-800 border-[#00B4D8] rounded"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#00B4D8] hover:text-[#48CAE4] transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#00B4D8] hover:text-[#48CAE4] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="pharma"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#00B4D8]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="pharmaOutline"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                <img src="/icons/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign up with Google
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#00B4D8] hover:text-[#48CAE4] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-400">
          <div>
            <div className="w-8 h-8 bg-[#00B4D8] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-[#03045E] font-bold">✓</span>
            </div>
            <p>Fast Delivery</p>
          </div>
          <div>
            <div className="w-8 h-8 bg-[#00B4D8] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-[#03045E] font-bold">✓</span>
            </div>
            <p>Authentic Products</p>
          </div>
          <div>
            <div className="w-8 h-8 bg-[#00B4D8] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-[#03045E] font-bold">✓</span>
            </div>
            <p>24/7 Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 