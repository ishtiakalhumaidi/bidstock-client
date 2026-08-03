/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Briefcase, Package, Warehouse, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import { useAuth } from "../../hooks/useAuth";

const ROLES = [
  { value: "buyer", label: "Buy stock", icon: Briefcase },
  { value: "seller", label: "Sell stock", icon: Package },
  { value: "warehouse_owner", label: "Rent space", icon: Warehouse },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: "buyer", status: "active", user_image: "" },
  });

  const selectedRole = watch("role");

  const mutation = useMutation({
    mutationFn: (payload) => signup(payload),
    onSuccess: () => {
      toast.success("Account created — sign in to continue");
      navigate("/auth/signin");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not create account");
    },
  });

  const onSubmit = (data) => {
    const { terms, ...payload } = data;
    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row-reverse">
      
      {/* Right Brand Pane (Reversed for SignUp variation) */}
      <div className="hidden lg:flex w-1/2 bg-ink text-paper p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            
             <div className="bg-paper p-1.5 rounded-lg"><Logo /></div>
          </div>
        </div>

        <div className="relative z-10 max-w-lg ml-auto text-right">
          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
            Architect your logistics.
          </h1>
          <p className="text-lg text-white/60 font-medium">
            Join the decentralized marketplace. List bulk commodities, secure warehouse space, and execute wholesale transactions globally.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest">
          <span>Status: Operational</span>
          <span>© 2026 BidStock System</span>
        </div>
      </div>

      {/* Left Form Pane */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-paper overflow-y-auto">
        
        {/* Mobile/Floating Nav */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div className="lg:hidden"><Logo /></div>
        </div>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12 lg:mt-0 py-8">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-3xl text-ink tracking-tight mb-2">Create account</h2>
            <p className="text-ink-soft">Select your operational role and establish your credentials.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Role Selection Blocks */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-ink-soft mb-3 uppercase tracking-wider font-mono">
                Platform Role <span className="text-red">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((role) => {
                  const active = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValue("role", role.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all press-scale ${
                        active 
                          ? "border-ink bg-ink text-paper shadow-md" 
                          : "border-line bg-white text-ink-soft hover:border-ink hover:shadow-sm"
                      }`}
                    >
                      <role.icon size={18} className={active ? "text-amber" : ""} />
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("role", { required: true })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                required
                placeholder="John Doe"
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
              <Input
                label="Phone number"
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
                error={errors.phone?.message}
                {...register("phone", { required: "Phone is required" })}
              />
            </div>

            <Input
              label="Email address"
              required
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">
                Password <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full rounded-lg border ${
                    errors.password ? "border-red" : "border-line-strong"
                  } bg-white px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none transition-colors shadow-sm`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red mt-1.5">{errors.password.message}</p>}
            </div>

            <label className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-line-strong text-ink focus:ring-ink accent-[#14181F]"
                {...register("terms", { required: "You must accept the terms" })}
              />
              <span className="text-sm text-ink-soft">
                I agree to the <a href="#" className="font-medium text-ink hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-ink hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red -mt-2">{errors.terms.message}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full h-11 text-base mt-4" loading={mutation.isPending}>
              {mutation.isPending ? null : (
                <>Create account <ArrowRight size={16} className="ml-1" /></>
              )}
            </Button>
          </form>

          <p className="mt-8 text-sm text-ink-soft text-center">
            Already have an account?{" "}
            <Link to="/auth/signin" className="font-semibold text-ink hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}