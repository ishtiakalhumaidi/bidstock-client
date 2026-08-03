import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Store, Warehouse, Shield } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import { useAuth } from "../../hooks/useAuth";
import { signIn } from "../../api/auth.api";

const DEMO_ACCOUNTS = [
  { role: "seller", label: "Seller", icon: Store, email: "seller@bidstock.com", password: "12345678" },
  { role: "buyer", label: "Buyer", icon: User, email: "buyer@bidstock.com", password: "12345678" },
  { role: "warehouse_owner", label: "Warehouse", icon: Warehouse, email: "w.owner@bidstock.com", password: "12345678" },
  { role: "admin", label: "Admin", icon: Shield, email: "owner@bidstock.com", password: "bidstock123" },
];

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
 const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: ({ email, password }) => signIn(email, password),
    onSuccess: (res) => {
      login(res.data.user, res.data.token, res.data.refreshToken); 
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}`);
      navigate(from, { replace: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Sign in failed");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);
  const handleDemoLogin = (account) => mutation.mutate({ email: account.email, password: account.password });

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      
      {/* Left Brand Pane (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-ink text-paper p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-amber/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-paper p-1.5 rounded-lg">
            <Logo />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
            Welcome back to the floor.
          </h1>
          <p className="text-lg text-white/60 font-medium">
            Resume your operations. Track logistics, manage inventory, and monitor your active auctions in real-time.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest">
          <span>© 2026 BidStock System</span>
          <span>Status: Operational</span>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-paper">
        
        {/* Mobile/Floating Nav */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center lg:justify-end">
          <div className="lg:hidden"><Logo /></div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>

        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12 lg:mt-0">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-3xl text-ink tracking-tight mb-2">Sign in</h2>
            <p className="text-ink-soft">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              required
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
              })}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-ink-soft">
                  Password <span className="text-red">*</span>
                </label>
                <button type="button" className="text-xs font-medium text-ink-muted hover:text-ink transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border ${
                    errors.password ? "border-red" : "border-line-strong"
                  } bg-white px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none transition-colors shadow-sm`}
                  {...register("password", { required: "Password is required" })}
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

            <Button type="submit" variant="primary" className="w-full h-11 text-base mt-2" loading={mutation.isPending}>
              {mutation.isPending ? null : (
                <>Sign in <ArrowRight size={16} className="ml-1" /></>
              )}
            </Button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-10 pt-6 border-t border-line">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  disabled={mutation.isPending}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-line bg-white hover:border-ink hover:shadow-sm transition-all press-scale disabled:opacity-50"
                >
                  <account.icon size={18} className="text-ink-soft" />
                  <span className="text-xs font-medium text-ink">{account.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-ink-soft text-center">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="font-semibold text-ink hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}