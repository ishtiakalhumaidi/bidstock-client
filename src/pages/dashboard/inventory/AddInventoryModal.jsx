import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Building2, Package, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../../api/auth.api';

export default function AddInventoryModal({ product, isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();


  const { data: rents, isLoading: isLoadingRents } = useQuery({
    queryKey: ['my-active-rents'],
    queryFn: async () => {
      const res = await api.get('/rents/my-rents');
      return res.data.data.filter(r => r.status === 'active');
    },
    enabled: isOpen, 
  });
console.log(rents)
  const mutation = useMutation({
    mutationFn: (data) => {
      return api.post('/inventories', {
        product_id: product.product_id,
        warehouse_id: data.warehouse_id,
        quantity: parseInt(data.quantity),
        min_stock_level: parseInt(data.min_stock_level),
        max_stock_level: parseInt(data.max_stock_level)
      });
    },
    onSuccess: () => {
      alert('Stock added to warehouse successfully!');
      reset();
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to add inventory');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Add Stock to Warehouse</h3>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
               <Package size={14} className="text-rose-500"/> 
               Selected Product: <span className="font-semibold text-zinc-700">{product?.name}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          
          {/* Warehouse Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Select Warehouse</label>
            {isLoadingRents ? (
               <div className="flex items-center gap-2 text-sm text-zinc-400 h-10 px-3 border rounded-xl">
                 <Loader2 className="animate-spin h-4 w-4" /> Loading warehouses...
               </div>
            ) : rents?.length === 0 ? (
               <div className="p-3 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-100 flex gap-2">
                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
                 <div>
                   You don't have any rented warehouses. 
                   <a href="/dashboard/warehouses/all" className="underline font-bold ml-1">Rent one first.</a>
                 </div>
               </div>
            ) : (
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 text-zinc-400 h-5 w-5" />
                <select 
                  {...register("warehouse_id", { required: "Please select a warehouse" })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
                >
                  <option value="">Choose a Warehouse</option>
                  {rents.map(rent => (
                    <option key={rent.rent_id} value={rent.warehouse_id}>
                      {rent.warehouse_location} (Cap: {rent.warehouse_capacity})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {errors.warehouse_id && <p className="text-xs text-red-500">{errors.warehouse_id.message}</p>}
          </div>

          {/* Quantity Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
               <label className="text-sm font-semibold text-zinc-700">Quantity</label>
               <input 
                 type="number" 
                 {...register("quantity", { required: true, min: 1 })}
                 className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                 placeholder="500"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-semibold text-zinc-700">Min Alert</label>
               <input 
                 type="number" 
                 {...register("min_stock_level", { value: 10 })}
                 className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                 placeholder="10"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-semibold text-zinc-700">Max Cap</label>
               <input 
                 type="number" 
                 {...register("max_stock_level", { value: rents.warehouse_capacity })}
                 className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                 placeholder="1000"
               />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-sm text-blue-700">
             <Layers className="h-5 w-5 shrink-0 mt-0.5" />
             <p>Adding stock creates an inventory record. You can manage stock levels later in the Inventory tab.</p>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending || rents?.length === 0}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Package />} 
            Confirm Stock Addition
          </button>
        </form>
      </motion.div>
    </div>
  );
}