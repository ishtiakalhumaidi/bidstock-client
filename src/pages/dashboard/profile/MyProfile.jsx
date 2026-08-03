import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Save, Shield, Mail, Phone, Lock, Activity, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { updateUser } from "../../../api/users.api";
import { useAuth } from "../../../hooks/useAuth";
import Card, { CardHeader, CardBody } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";

export default function MyProfile() {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      user_image: user?.user_image,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => updateUser(user.user_id, payload),
    onSuccess: (_, variables) => {
      toast.success("Identity parameters successfully updated.");
      
      
      const updatedUser = { ...user, ...variables };
      login(updatedUser, localStorage.getItem("token"));
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update profile ledger."),
  });

  const onSubmit = (data) => {

    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
    }
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      
      {/* Header section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Activity size={12} className="text-teal" />
            Account Configuration
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Identity & Security</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Identity Snapshot */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/80 backdrop-blur-md overflow-hidden text-center border-ink/5">
            <div className="h-24 bg-gradient-to-br from-paper-dim to-line border-b border-line" />
            <div className="px-6 pb-6 relative">
              
              {/* Avatar Anchor */}
              <div className="relative inline-block -mt-12 mb-4">
                <div className="h-24 w-24 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  {user?.user_image ? (
                    <img src={user.user_image} alt={user?.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={40} className="text-ink-muted/50" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-paper border border-line rounded-lg flex items-center justify-center text-ink-soft shadow-sm">
                  <Camera size={14} />
                </div>
              </div>

              {/* User Metadata */}
              <h2 className="font-display font-semibold text-xl text-ink leading-tight">
                {user?.name || "System User"}
              </h2>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-teal-soft/30 border border-teal/20 text-teal rounded-full text-xs font-mono uppercase tracking-wider font-semibold">
                <Shield size={12} />
                {user?.role?.replace("_", " ") || "Standard Node"}
              </div>
              
              <div className="mt-6 pt-6 border-t border-line border-dashed space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-ink-soft">
                  <Mail size={14} className="text-ink-muted" />
                  <span className="truncate">{user?.email || "No email bound"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-soft">
                  <Phone size={14} className="text-ink-muted" />
                  <span>{user?.phone || "No phone bound"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Parameters */}
        <div className="lg:col-span-2">
          <form id="profile-update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Module 1: Contact Details */}
            <Card className="bg-white/80 backdrop-blur-md">
              <CardHeader 
                title="Primary Parameters" 
                eyebrow="Module 01" 
                className="bg-paper-dim/30"
              />
              <CardBody className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Legal Identity (Full Name)"
                    required
                    placeholder="Enter your registered name"
                    error={errors.name?.message}
                    {...register("name", { required: "Name is strictly required" })}
                  />
                  <Input
                    label="Contact Node (Phone)"
                    placeholder="Enter active phone number"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="Secure Comm Link (Email)"
                    required
                    type="email"
                    className="sm:col-span-2"
                    placeholder="name@domain.com"
                    error={errors.email?.message}
                    {...register("email", { required: "Email is strictly required" })}
                  />
                  <Input
                    label="Avatar Source URL"
                    type="url"
                    className="sm:col-span-2"
                    placeholder="https://storage.provider.com/avatar.jpg"
                    {...register("user_image")}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Module 2: Security Constraints */}
            <Card className="bg-white/80 backdrop-blur-md border-amber/20 shadow-sm">
              <div className="p-4 border-b border-amber/10 bg-amber-soft/10 flex items-center gap-2">
                <Lock size={14} className="text-amber-dark" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-amber-dark">Security Protocol</h3>
              </div>
              <CardBody>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-1/3">
                    <p className="text-sm font-medium text-ink mb-1">Access Credential</p>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Update your encryption key. Leave this field completely blank to retain your existing secure password.
                    </p>
                  </div>
                  <div className="sm:w-2/3">
                    <Input
                      label="New Password Token"
                      type="password"
                      placeholder="••••••••••••"
                      error={errors.password?.message}
                      {...register("password", { 
                        minLength: { value: 6, message: "Security standard requires ≥ 6 characters" }
                      })}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Execution Node */}
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                icon={Save} 
                loading={mutation.isPending}
                className="w-full sm:w-auto shadow-sm"
              >
                Commit Configuration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}