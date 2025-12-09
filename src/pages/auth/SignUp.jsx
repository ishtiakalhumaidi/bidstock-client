import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Package,
  Warehouse,
  Briefcase,
} from "lucide-react";
import Logo from "../../components/common/Logo";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("buyer");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { role: "buyer" },
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data) => {
    console.log("Registration Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        // CHANGED: max-w-2xl -> max-w-xl to match SignIn
        className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <Logo />
          </Link>
          {/* Header already text-3xl */}
          <h2 className="text-3xl font-bold text-zinc-900">Create Account</h2>
          <p className="text-zinc-500 mt-2">
            Join the marketplace for modern supply chains
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection Grid */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              I want to...
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Buyer Option */}
              <div
                onClick={() => handleRoleSelect("buyer")}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                  selectedRole === "buyer"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-zinc-100 bg-white text-zinc-500 hover:border-rose-200"
                }`}
              >
                <Briefcase className="h-6 w-6" />
                <span className="text-sm font-bold">Buy Stock</span>
                <input
                  type="radio"
                  value="buyer"
                  className="hidden"
                  {...register("role")}
                />
              </div>

              {/* Supplier Option */}
              <div
                onClick={() => handleRoleSelect("supplier")}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                  selectedRole === "supplier"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-zinc-100 bg-white text-zinc-500 hover:border-rose-200"
                }`}
              >
                <Package className="h-6 w-6" />
                <span className="text-sm font-bold">Sell Stock</span>
              </div>

              {/* Warehouse Option */}
              <div
                onClick={() => handleRoleSelect("warehouse")}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                  selectedRole === "warehouse"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-zinc-100 bg-white text-zinc-500 hover:border-rose-200"
                }`}
              >
                <Warehouse className="h-6 w-6" />
                <span className="text-sm font-bold">Rent Space</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.name
                      ? "border-red-500"
                      : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                  } bg-white focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  type="email"
                  placeholder="john@company.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.email
                      ? "border-red-500"
                      : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                  } bg-white focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                  errors.password
                    ? "border-red-500"
                    : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                } bg-white focus:ring-2 focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              {...register("terms", { required: "You must accept terms" })}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
            />
            <label className="text-sm text-zinc-500">
              I agree to the{" "}
              <a
                href="#"
                className="text-rose-600 font-semibold hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-rose-600 font-semibold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.terms && (
            <p className="text-xs text-red-500 font-medium ml-1">
              {errors.terms.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {isSubmitting ? "Creating Account..." : "Get Started"}
            {!isSubmitting && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <p className="text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/signin"
              className="font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
