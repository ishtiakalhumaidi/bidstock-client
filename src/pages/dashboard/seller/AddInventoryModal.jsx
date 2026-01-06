import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Warehouse, AlertTriangle, ArrowRight, Package, Calculator, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';

export default function AddInventoryModal({ product, onClose }) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minAlert, setMinAlert] = useState(5);
  const queryClient = useQueryClient();

  // 1. Fetch Active Rents (Where the seller can actually store items)
  const { data: activeRents, isLoading, isError } = useQuery({
    queryKey: ['my-active-rents'], // Changed query key
    queryFn: async () => {
      const res = await api.get('/rents/my-rents');
      // Robust handling for the response format
      const rawData = res.data.data;
      if (Array.isArray(rawData)) return rawData;
      if (rawData && typeof rawData === 'object') return [rawData]; 
      return [];
    },
  });

  // --- CALCULATION LOGIC ---
  // Find the selected RENT object
  const selectedRent = activeRents?.find(r => r.warehouse_id === parseInt(selectedWarehouseId));
  
  // Map fields correctly based on rent.service.ts response structure
  const totalCapacity = parseFloat(selectedRent?.warehouse_capacity || 0);
  
  // NOTE: 'used_capacity' might not be in the rent response yet. 
  // If your backend doesn't send it, this defaults to 0 (assuming empty).
  const usedCapacity = parseFloat(selectedRent?.used_capacity || 0); 
  const availableSpace = Math.max(0, totalCapacity - usedCapacity);

  const productSize = parseFloat(product?.size || 0);
  
  const maxAddable = productSize > 0 
    ? Math.floor(availableSpace / productSize) 
    : 99999; 

  const neededSpace = quantity * productSize;
  const isOverCapacity = quantity > maxAddable;

  const mutation = useMutation({
    mutationFn: (data) => api.post('/inventories/add', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      queryClient.invalidateQueries(['inventory']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOverCapacity || !selectedWarehouseId) return;

    mutation.mutate({
      product_id: product.product_id,
      warehouse_id: selectedWarehouseId,
      quantity: parseInt(quantity),
      min_stock_alert: parseInt(minAlert)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/80">
          <div>
            <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
              <Package className="text-rose-600" size={20} /> Add Stock
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Adding: <span className="font-semibold text-zinc-700">{product.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          
          {/* 1. Select Active Rent */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Select Rented Facility</label>
            <div className="relative">
              <Warehouse className="absolute left-3 top-3.5 text-zinc-400 h-5 w-5" />
              <select 
                required
                className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-xl focus:ring-2 outline-none transition-all appearance-none text-zinc-700 ${
                    isError ? 'border-red-300 bg-red-50' : 'border-zinc-200 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
                onChange={(e) => {
                    setSelectedWarehouseId(e.target.value);
                    setQuantity(1);
                }}
                value={selectedWarehouseId}
                disabled={isLoading || isError}
              >
                <option value="">
                    {isLoading ? "Loading your rented facilities..." : 
                     isError ? "Error loading facilities" : 
                     "-- Choose a Facility --"}
                </option>
                
                {/* Updated Mapping for Rent Object */}
                {activeRents?.map(rent => (
                  <option key={rent.warehouse_id} value={rent.warehouse_id}>
                    {rent.warehouse_location} (Cap: {parseFloat(rent.warehouse_capacity).toLocaleString()} sq ft)
                  </option>
                ))}
              </select>
            </div>
            
            {isError && (
                <p className="text-xs text-red-500">
                    Failed to load rents. Check console.
                </p>
            )}
             {!isLoading && !isError && activeRents?.length === 0 && (
                <p className="text-xs text-amber-600">
                    You have no active warehouse rents. Please rent a facility first.
                </p>
            )}
          </div>

          {/* 2. Calculated Limits */}
          {selectedWarehouseId && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <Calculator size={16} /> Storage Calculation
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-sm">
                  <span className="block text-zinc-500 text-xs uppercase tracking-wider font-bold">Product Size</span>
                  <span className="font-mono font-medium text-zinc-800">{productSize} sq ft</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-sm">
                  <span className="block text-zinc-500 text-xs uppercase tracking-wider font-bold">Max Capacity</span>
                  <span className="font-mono font-bold text-blue-600 text-lg">{maxAddable.toLocaleString()} <span className="text-xs text-zinc-400">units</span></span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Inputs Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Quantity</label>
              <input 
                type="number" 
                min="1" 
                max={maxAddable}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!selectedWarehouseId}
                className={`w-full px-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 transition-all font-mono text-lg ${
                  isOverCapacity 
                    ? 'border-red-300 text-red-600 focus:ring-red-200' 
                    : 'border-zinc-200 text-zinc-900 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">
                Min Alert <span className="text-zinc-400 font-normal text-xs">(Low Stock)</span>
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3.5 text-amber-500 h-4 w-4" />
                <input 
                  type="number" 
                  min="0"
                  value={minAlert}
                  onChange={(e) => setMinAlert(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
            </div>
          </div>

          {/* Error / Info Message */}
          {selectedWarehouseId && (
             <div className="text-sm">
                {isOverCapacity ? (
                   <p className="text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                     <AlertTriangle size={16} /> Exceeds limit! Max possible is {maxAddable}.
                   </p>
                ) : (
                   <div className="flex items-center justify-between text-zinc-500 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                      <span>Space Required:</span>
                      <span className="font-mono font-medium text-zinc-900">{neededSpace.toLocaleString()} sq ft</span>
                   </div>
                )}
             </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!selectedWarehouseId || isOverCapacity || mutation.isPending}
            className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {mutation.isPending ? 'Processing...' : <>Confirm Inventory <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}