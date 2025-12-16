import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, Package } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';

export default function EditInventoryModal({ item, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      quantity: item.quantity,
      min_stock_level: item.min_stock_level,
      max_stock_level: item.max_stock_level
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.put(`/inventories/${item.product_id}/${item.warehouse_id}`, data);
    },
    onSuccess: () => {
      alert('Inventory updated successfully!');
      queryClient.invalidateQueries(['my-inventory']);
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update inventory');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="font-bold text-zinc-900">Edit Stock Level</h3>
          <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
        </div>

        <form onSubmit={handleSubmit(mutation.mutate)} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Quantity</label>
            <input 
              type="number" 
              {...register("quantity", { required: true, min: 0 })}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Min Alert</label>
              <input type="number" {...register("min_stock_level")} className="w-full p-2.5 border border-zinc-200 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Max Cap</label>
              <input type="number" {...register("max_stock_level")} className="w-full p-2.5 border border-zinc-200 rounded-lg" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}