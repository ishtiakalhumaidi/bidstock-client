import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, Edit2, Save, X, Camera, Loader2 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../api/auth.api';


export default function Profile() {
  const { user: authUser } = useAuth(); 
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);


  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['profile', authUser?.user_id],
    queryFn: async () => {
      const res = await api.get(`/users/${authUser?.user_id}`);
      return res.data.data;
    },
    enabled: !!authUser?.user_id,
  });

  console.log(userProfile);

  // 2. Setup Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 3. Update Mutation
  const mutation = useMutation({
    mutationFn: (data) => api.put(`/users/${authUser?.user_id}`, data),
    onSuccess: () => {
      alert("Profile updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries(['profile']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Update failed");
    }
  });

  React.useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile, reset]);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Profile</h1>
          <p className="text-sm text-zinc-500">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 font-medium text-zinc-700 transition-colors"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        {/* Banner / Header */}
        <div className="h-32 bg-gradient-to-r from-rose-500 to-orange-400 relative">
           <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                   <div className="h-full w-full bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                      {/* Placeholder for User Image */}
                     {userProfile?.user_image?<img className='w-full h-full overflow-hidden rounded-2xl object-cover' src={userProfile?.user_image} alt={userProfile.name} /> : <User size={40} />}
                   </div>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 shadow-md">
                    <Camera size={14} />
                  </button>
                )}
              </div>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8">
           <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-6 max-w-2xl">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Name */}
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                       <input 
                         {...register("name", { required: "Name is required" })}
                         disabled={!isEditing}
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-500 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                       />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                 </div>

     
                 <div className="space-y-1.5 opacity-75">
                    <label className="text-sm font-semibold text-zinc-700">Account Role</label>
                    <div className="relative">
                       <Shield className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                       <input 
                         type="text" 
                         value={userProfile?.role} 
                         disabled 
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 uppercase font-bold text-xs tracking-wider"
                       />
                    </div>
                 </div>

                 {/* Email */}
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                       <input 
                         type="email"
                         {...register("email", { required: "Email is required" })}
                         disabled={!isEditing}
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-500 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                       <input 
                         type="tel"
                         {...register("phone")}
                         disabled={!isEditing}
                         placeholder="+1 234 567 890"
                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-500 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                       />
                    </div>
                 </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex gap-3 pt-4 border-t border-zinc-100"
                  >
                    <button 
                      type="button" 
                      onClick={() => {
                        reset();
                        setIsEditing(false);
                      }}
                      className="px-6 py-2.5 rounded-xl border border-zinc-200 font-medium text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-2"
                    >
                      <X size={18} /> Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={mutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 font-medium text-white hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20"
                    >
                      {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                      Save Changes
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

           </form>
        </div>
      </div>
    </div>
  );
}