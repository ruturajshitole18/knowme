import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, PlusCircle, LayoutDashboard, LogIn, LogOut, User, Database, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isSupabase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();

  const handleSignOut = async () => {
    await signOut();
    success('Logged Out', 'You have been successfully signed out.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0A071E]/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0A071E] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
              Know<span className="text-pink-400">Me</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-purple-300/70 font-semibold -mt-1 hidden sm:inline-block">
              Friendship Quiz
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-pink-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Features
          </a>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') ? 'text-pink-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Backend Status indicator */}
          <div
            title={
              isSupabase
                ? 'Supabase Cloud Backend Active'
                : 'Local High-Speed Storage Mode Active (Add keys to .env to connect live Supabase)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isSupabase
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
            }`}
          >
            {isSupabase ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Local DB</span>
              </>
            )}
          </div>

          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create My Quiz</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-200 hover:text-pink-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate font-medium">{user.display_name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-2 rounded-lg text-sm font-medium border border-purple-500/40 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/create"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Create
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-white/10 px-6 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-pink-400 py-1"
            >
              Home
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-pink-400 py-1"
            >
              How It Works
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-pink-400 py-1"
            >
              Features
            </a>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-pink-400 py-1 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                Creator Dashboard
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.display_name}</p>
                    <p className="text-xs text-purple-300">Creator Account</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-white/5 border border-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
