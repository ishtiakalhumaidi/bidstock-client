import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Gavel, Calendar, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';
import { useAuth } from '../../../hooks/useAuth';

export default function AddToBidModal({ item, isOpen, onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.post('/bids', {
        product_id: item.product_id,
        seller_id: user.user_id,
        start_time: data.start_time,
        end_time: data.end_time,
      });
    },
    onSuccess: () => {
      alert('Auction started successfully!');
      queryClient.invalidateQueries(['my-bids']); // Optional: if you have a bids list
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to start bid');
    }
  });

  if (!isOpen) return null;

  // Min datetime for inputs
  const now = new Date().toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Start Auction</h3>
            <p className="text-sm text-zinc-500">For: {item.product_name}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-zinc-400 hover:text-zinc-600" /></button>
        </div>

        <form onSubmit={handleSubmit(mutation.mutate)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Auction Start Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input 
                type="datetime-local"
                min={now}
                {...register("start_time", { required: "Start time is required" })}
                className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            {errors.start_time && <p className="text-xs text-red-500">{errors.start_time.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Auction End Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input 
                type="datetime-local"
                min={now}
                {...register("end_time", { required: "End time is required" })}
                className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            {errors.end_time && <p className="text-xs text-red-500">{errors.end_time.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Gavel className="h-4 w-4" />}
            Launch Auction
          </button>
        </form>
      </motion.div>
    </div>
  );
}