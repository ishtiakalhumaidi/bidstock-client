import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Save, Package, DollarSign, Scale, Maximize, FileText, Layers, Tag, ImageIcon, Activity } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';

export default function EditProductModal({ product, onClose }) {
  const queryClient = useQueryClient();

  // Setup form with default values from the selected product
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      size: product.size,
      category: product.category,
      brand: product.brand,
      image_url: product.image_url,
      status: product.status || 'active'
    }
  });

  // Reset form if product changes
  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      size: product.size,
      category: product.category,
      brand: product.brand,
      image_url: product.image_url,
      status: product.status
    });
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data) => api.put(`/products/${product.product_id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      onClose();
    },
  });

  const onSubmit = (data) => {
    // Ensure numbers are sent as numbers
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      weight: parseFloat(data.weight),
      size: parseFloat(data.size),
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
              <Edit2Icon className="text-rose-600" size={20} /> Edit Product
            </h3>
            <p className="text-sm text-zinc-500">Updating: {product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Product Name</label>
                <div className="relative">
                   <Package className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input 
                     {...register("name", { required: "Name is required" })}
                     className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" 
                     placeholder="Product Name"
                   />
                </div>
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
             </div>

             <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Description</label>
                <div className="relative">
                   <FileText className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <textarea 
                     {...register("description")}
                     rows={3}
                     className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none" 
                     placeholder="Product Details..."
                   />
                </div>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Price ($)</label>
                <div className="relative">
                   <DollarSign className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input type="number" step="0.01" {...register("price", { required: true })} className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-rose-500" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Weight (kg)</label>
                <div className="relative">
                   <Scale className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input type="number" step="0.01" {...register("weight", { required: true })} className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-rose-500" />
                </div>
             </div>
             <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-sm font-semibold text-zinc-700">Size (sq ft)</label>
                <div className="relative">
                   <Maximize className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input type="number" step="0.01" {...register("size", { required: true })} className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-rose-500" />
                </div>
             </div>
          </div>

          {/* Categorization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Category</label>
                <div className="relative">
                   <Layers className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input {...register("category")} className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-rose-500" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Brand</label>
                <div className="relative">
                   <Tag className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input {...register("brand")} className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-rose-500" />
                </div>
             </div>
          </div>

          {/* Image & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Image URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <input {...register("image_url")} className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-rose-500" placeholder="https://..." />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Status</label>
                <div className="relative">
                   <Activity className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
                   <select {...register("status")} className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-rose-500 appearance-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                   </select>
                </div>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSubmit(onSubmit)} 
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2"
            >
              {mutation.isPending ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
        </div>
      </motion.div>
    </div>
  );
}

// Icon helper
const Edit2Icon = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);