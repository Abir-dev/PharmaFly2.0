import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.error) {
        setErrors({ general: result.error });
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-[#00B4D8] hover:text-[#48CAE4] mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-gray-900 border-[#00B4D8] shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <img src="/drone.png" alt="PharmaFly Drone Logo" className="h-10 w-10" />
            </div>
            <CardTitle className="text-xl font-bold text-[#48CAE4]">
              Sign in to PharmaFly
            </CardTitle>
            <p className="text-sm text-gray-400">
              <span className="text-[#00B4D8] font-semibold">PharmaFly</span> delivers essential medicines via drones.
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs">{errors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-[#CAF0F8]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${errors.email ? 'border-red-500' : 'border-[#00B4D8]'}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-[#CAF0F8]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-2.5 bg-gray-800 border rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] transition-colors ${errors.password ? 'border-red-500' : 'border-[#00B4D8]'}`}
                    placeholder="Enter your password"
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
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="pharma"
                size="default"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#00B4D8]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="pharmaOutline"
                size="default"
                className="w-full"
                disabled={isLoading}
              >
                <img src="/icons/google.svg" alt="Google" className="h-4 w-4 mr-2" />
                Sign in with Google
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#00B4D8] hover:text-[#48CAE4] font-medium transition-colors"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-400">
          <div>
            <div className="w-6 h-6 bg-[#00B4D8] rounded-full mx-auto mb-1 flex items-center justify-center">
              <span className="text-[#03045E] font-bold text-xs">✓</span>
            </div>
            <p>Fast Delivery</p>
          </div>
          <div>
            <div className="w-6 h-6 bg-[#00B4D8] rounded-full mx-auto mb-1 flex items-center justify-center">
              <span className="text-[#03045E] font-bold text-xs">✓</span>
            </div>
            <p>Authentic</p>
          </div>
          <div>
            <div className="w-6 h-6 bg-[#00B4D8] rounded-full mx-auto mb-1 flex items-center justify-center">
              <span className="text-[#03045E] font-bold text-xs">✓</span>
            </div>
            <p>24/7 Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 