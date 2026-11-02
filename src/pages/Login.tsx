import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { signIn, resetPassword, isSupabase } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const result = await signIn(data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      success('Welcome back!', 'You have logged in successfully.');
      navigate(from, { replace: true });
    } else {
      toastError('Login Failed', result.error || 'Please check your email and password.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      toastError('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setResetLoading(true);
    const res = await resetPassword(resetEmail);
    setResetLoading(false);
    if (res.success) {
      success('Email Sent', 'Check your inbox for password reset instructions.');
      setResetModalOpen(false);
    } else {
      toastError('Reset Failed', res.error || 'Could not send reset email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-radial-gradient">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5 shadow-glow-purple">
            <div className="w-full h-full bg-[#0A071E] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Log In to Know<span className="text-pink-400">Me</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your quizzes, view scores, and inspect analytics.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] text-purple-300 hover:text-pink-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Note */}
          {!isSupabase && (
            <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <p className="text-[11px] text-purple-200">
                🚀 <strong>Instant Access Mode:</strong> You can enter any email & password (or sign up) to immediately access the creator dashboard and test all features!
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-semibold text-pink-400 hover:text-pink-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-300">
              Enter your email and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
              />
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  {resetLoading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
