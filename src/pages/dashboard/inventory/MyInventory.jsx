import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, MapPin, Edit2, Trash2, Gavel, Loader2, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';
import AddToBidModal from '../bid/AddToBidModal';
import EditInventoryModal from './EditInventoryModal';


export default function MyInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidItem, setSelectedBidItem] = useState(null);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const queryClient = useQueryClient();


  const { data: inventory, isLoading, isError } = useQuery({
    queryKey: ['my-inventory'],
    queryFn: async () => {
      const res = await api.get('/inventories/my-inventory');
      return res.data.data;
    }
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (item) => api.delete(`/inventory/${item.product_id}/${item.warehouse_id}`),
    onSuccess: () => queryClient.invalidateQueries(['my-inventory']),
    onError: (err) => alert(err.response?.data?.message || "Failed to delete")
  });

  const handleDelete = (item) => {
    if(window.confirm(`Remove ${item.product_name} from this warehouse?`)) {
      deleteMutation.mutate(item);
    }
  };

  // Filter Logic
  const filteredItems = inventory?.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.warehouse_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={32}/></div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load inventory.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Warehouse Inventory</h1>
          <p className="text-zinc-500 text-sm">Manage stock levels and launch auctions.</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products or warehouses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredItems?.map((item) => (
            <motion.div 
              key={`${item.product_id}-${item.warehouse_id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="h-full w-full object-cover rounded-xl"/>
                    ) : (
                      <Package className="text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{item.product_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin size={12} /> {item.warehouse_location}
                    </div>
                  </div>
                </div>
                {/* Low Stock Alert */}
                {item.quantity <= item.min_stock_level && (
                  <div className="text-amber-500" title="Low Stock">
                    <AlertTriangle size={18} />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <span className="block text-xs text-zinc-500 uppercase font-bold">Qty</span>
                  <span className="text-lg font-bold text-zinc-900">{item.quantity}</span>
                </div>
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <span className="block text-xs text-zinc-500 uppercase font-bold">Min</span>
                  <span className="text-sm font-medium text-zinc-600">{item.min_stock_level}</span>
                </div>
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <span className="block text-xs text-zinc-500 uppercase font-bold">Max</span>
                  <span className="text-sm font-medium text-zinc-600">{item.max_stock_level}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedBidItem(item)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Gavel size={14} /> Auction
                </button>
                <button 
                  onClick={() => setSelectedEditItem(item)}
                  className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item)}
                  className="p-2 border border-zinc-200 rounded-lg hover:bg-red-50 text-zinc-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedBidItem && (
          <AddToBidModal 
            item={selectedBidItem} 
            isOpen={!!selectedBidItem} 
            onClose={() => setSelectedBidItem(null)} 
          />
        )}
        {selectedEditItem && (
          <EditInventoryModal
            item={selectedEditItem} 
            isOpen={!!selectedEditItem} 
            onClose={() => setSelectedEditItem(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}