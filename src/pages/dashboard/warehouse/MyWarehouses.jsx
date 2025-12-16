import React, { useState } from 'react';
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MapPin, 
  Maximize, 
  Warehouse, 
  Loader2, 
  Building2,
  Trash2,
  Edit2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';

const WarehouseCard = ({ warehouse, onDelete, onEdit }) => {
  // Helper to format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Status Badge Colors Configuration
  const statusConfig = {
    available: {
      color: 'bg-emerald-100 text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Available'
    },
    booked: {
      color: 'bg-blue-100 text-blue-700',
      dot: 'bg-blue-500',
      label: 'Booked'
    },
    maintenance: {
      color: 'bg-amber-100 text-amber-700',
      dot: 'bg-amber-500',
      label: 'Maintenance'
    }
  };

  const status = statusConfig[warehouse.status] || statusConfig.available;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-100 transition-all duration-300"
    >
      {/* Header / Visual Area */}
      <div className="relative h-28 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 p-5 flex items-start justify-between">
        
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-100 text-rose-600">
           <Building2 size={24} />
        </div>

        {/* Price Badge (New) */}
        <div className="flex flex-col items-end gap-2">
           <span className="bg-white/90 backdrop-blur text-rose-600 text-sm font-bold px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
             {formatPrice(warehouse.price)} <span className="text-xs font-normal text-zinc-500">/mo</span>
           </span>
           
           {/* Actions (Visible on Hover) */}
           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
              <button 
                onClick={() => onEdit(warehouse.warehouse_id)}
                className="p-1.5 bg-white rounded-lg hover:bg-rose-50 text-zinc-500 hover:text-rose-600 border border-zinc-200 shadow-sm transition-colors"
                title="Edit Warehouse"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(warehouse.warehouse_id)}
                className="p-1.5 bg-white rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600 border border-zinc-200 shadow-sm transition-colors"
                title="Delete Warehouse"
              >
                <Trash2 size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg mb-1 flex items-center gap-2">
            Warehouse #{warehouse.warehouse_id}
          </h3>
          <div className="flex items-start gap-2 text-zinc-500 text-sm">
             <MapPin size={16} className="mt-0.5 shrink-0" />
             <span className="line-clamp-2" title={warehouse.location}>{warehouse.location}</span>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-100" />

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
           <div className="flex flex-col">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Capacity</span>
              <div className="flex items-center gap-1.5 font-medium text-zinc-700 mt-0.5">
                 <Maximize size={16} className="text-rose-500" />
                 {warehouse.capacity.toLocaleString()} sq ft
              </div>
           </div>
           
           <div className="flex flex-col items-end">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${status.color}`}>
                 <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${warehouse.status === 'available' ? 'animate-pulse' : ''}`}></span>
                 {status.label}
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MyWarehouses() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // 1. Fetch Warehouses
  const { data: warehouses, isLoading, isError } = useQuery({
    queryKey: ['my-warehouses'],
    queryFn: async () => {
      const res = await api.get('/warehouses/my-warehouse'); 
      return res.data.data;
    },
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/warehouses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-warehouses']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this warehouse listing?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    console.log('Edit warehouse:', id);
    // navigate(`/dashboard/warehouses/edit/${id}`);
  };

  // 3. Filtering
  const filteredWarehouses = warehouses?.filter((item) => 
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center text-center">
        <Warehouse className="h-12 w-12 text-zinc-300 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900">Failed to load warehouses</h3>
        <p className="text-zinc-500 max-w-sm">
          Something went wrong fetching your facilities. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Warehouses</h1>
          <p className="text-sm text-zinc-500">
             Manage your storage facilities and capacity ({warehouses?.length || 0} locations)
          </p>
        </div>
        <Link
          to="/dashboard/warehouses/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform hover:scale-105 hover:bg-rose-700 active:scale-95"
        >
          <Plus size={18} />
          Add Warehouse
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by location or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredWarehouses?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
           <Warehouse className="h-10 w-10 text-zinc-300 mb-2" />
           <p className="text-zinc-500 font-medium">No warehouses found.</p>
           {searchTerm && <button onClick={() => setSearchTerm('')} className="text-rose-600 text-sm mt-2 hover:underline">Clear search</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredWarehouses.map((warehouse) => (
              <WarehouseCard 
                 key={warehouse.warehouse_id} 
                 warehouse={warehouse} 
                 onDelete={handleDelete}
                 onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}