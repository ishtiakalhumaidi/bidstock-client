import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../../components/common/logo';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    // Simulate API call
    console.log('Login Data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
         <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60"></div>
         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // CHANGED: max-w-md -> max-w-xl to match SignUp
        className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <Logo/>
          </Link>
          {/* CHANGED: text-2xl -> text-3xl to match SignUp */}
          <h2 className="text-3xl font-bold text-zinc-900">Welcome back</h2>
          <p className="text-zinc-500 mt-2 text-sm">Enter your details to access your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email" 
                placeholder="you@company.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:border-rose-500 focus:ring-rose-500'} bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:outline-none transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-zinc-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-rose-600 hover:text-rose-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
              <input 
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:border-rose-500 focus:ring-rose-500'} bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:outline-none transition-all`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">
              Create an account
            </Link>
          </p>
          <Link to="/" className="inline-flex items-center gap-1 mt-6 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}