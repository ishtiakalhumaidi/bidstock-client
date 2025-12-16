import React, { useState } from 'react';
import { Link } from 'react-router'; // Ensure correct import
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Loader2, PackageX, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../../../api/auth.api';
import { useAuth } from '../../../hooks/useAuth'; 

import ProductCard from '../../../components/ui/1. src/components/ui/ProductCard';
import AddInventoryModal from '../inventory/AddInventoryModal';

export default function MyProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // New State for Modal
  const [selectedProductForInventory, setSelectedProductForInventory] = useState(null);

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 1. Fetch Products
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const res = await api.get(`products/my-products/`); 
      return res.data.data;
    },
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    console.log('Navigate to edit page for:', id);
  };

  // 3. Filtering Logic
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;
  if (isError) return <div className="text-center p-10">Failed to load products</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Inventory</h1>
          <p className="text-sm text-zinc-500">
             Manage your active listings and warehouse stock ({products?.length || 0} items)
          </p>
        </div>
        <Link
          to="/dashboard/add-product"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform hover:scale-105 hover:bg-rose-700 active:scale-95"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-rose-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
           <Package className="h-10 w-10 text-zinc-300 mb-2" />
           <p className="text-zinc-500 font-medium">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard 
                 key={product.product_id} 
                 product={product} 
                 onDelete={handleDelete}
                 onEdit={handleEdit}
                 // Pass the handler to open modal
                 onAddToInventory={setSelectedProductForInventory} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Inventory Modal */}
      <AnimatePresence>
        {selectedProductForInventory && (
          <AddInventoryModal 
            product={selectedProductForInventory}
            isOpen={!!selectedProductForInventory}
            onClose={() => setSelectedProductForInventory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}