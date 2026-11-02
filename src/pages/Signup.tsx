import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupSchema } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    const result = await signUp(data.display_name, data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      success('Account Created!', `Welcome to KnowMe, ${data.display_name}!`);
      navigate('/dashboard', { replace: true });
    } else {
      toastError('Signup Failed', result.error || 'Could not complete registration.');
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
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Build personal quizzes, challenge friends, and track scores.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Display Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Your Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('display_name')}
                  placeholder="e.g. Ruturaj or Alex"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>
              {errors.display_name && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.display_name.message}
                </p>
              )}
            </div>

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
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('confirm_password')}
                  placeholder="Repeat your password"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirm_password.message}
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
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-pink-400 hover:text-pink-300">
                Log In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
