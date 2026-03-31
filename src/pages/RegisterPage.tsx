import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Crown, ArrowLeft, CheckCircle2, Camera, Building2 } from 'lucide-react';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('model');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      setStep(2);
      return;
    }

    const success = await register(formData.email, formData.password, selectedRole, formData.name);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4 -ml-4 text-gray-600"
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? 'Back to home' : 'Back'}
        </Button>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? 'Create your account' : 'Choose your role'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Start your journey in the fashion industry'
                : 'Select how you want to use ModelMatch'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('model')}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedRole === 'model'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        selectedRole === 'model' ? 'bg-amber-500' : 'bg-gray-100'
                      }`}>
                        <Camera className={`w-7 h-7 ${selectedRole === 'model' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">I'm a Model</h3>
                      <p className="text-sm text-gray-500">Find agencies and opportunities</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('agency')}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedRole === 'agency'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        selectedRole === 'agency' ? 'bg-amber-500' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`w-7 h-7 ${selectedRole === 'agency' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">I'm an Agency</h3>
                      <p className="text-sm text-gray-500">Discover and book talent</p>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {selectedRole === 'model' 
                          ? 'Create a professional portfolio to showcase your work'
                          : 'Post castings and manage your talent roster'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {selectedRole === 'model'
                          ? 'Connect directly with verified agencies worldwide'
                          : 'Access our database of verified models'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Free to join, pay only for premium features
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </>
              )}
            </form>

            {step === 1 && (
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                  Sign in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-amber-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
