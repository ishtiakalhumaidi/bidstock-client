import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Building2, 
  Clock, 
  ArrowRight, 
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/auth.api';

const formatDate = (dateString) => {
  if (!dateString) return 'Ongoing';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getLeaseProgress = (start, end) => {
  if (!end) return 0; 
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const today = new Date().getTime();

  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;

  const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  return percent;
};

const RentCard = ({ rent }) => {
  const progress = getLeaseProgress(rent.start_date, rent.end_date);
  
  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-5 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shadow-sm text-rose-600">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-sm">Rent #{rent.rent_id}</h3>
            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
              <MapPin size={12} />
              <span className="truncate max-w-[150px]" title={rent.warehouse_location}>
                {rent.warehouse_location}
              </span>
            </div>
          </div>
        </div>
        
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[rent.status] || statusColors.completed}`}>
          {rent.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Date Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase">Start Date</span>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Calendar size={14} className="text-emerald-500" />
              {formatDate(rent.start_date)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase">End Date</span>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Calendar size={14} className="text-rose-500" />
              {formatDate(rent.end_date)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {rent.status === 'active' && rent.end_date && (
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Lease Duration</span>
              <span className="font-medium text-zinc-700">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
         <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock size={12} /> Created: {formatDate(rent.created_at)}
         </span>
         
         <button className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors">
            View Details <ArrowRight size={14} />
         </button>
      </div>
    </motion.div>
  );
};


export default function MyRents() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rents, isLoading, isError } = useQuery({
    queryKey: ['my-rents'],
    queryFn: async () => {
      const res = await api.get('/rents/my-rents');
      return res.data.data;
    },
  });

  const filteredRents = rents?.filter(rent => 
    rent.warehouse_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rent.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <AlertCircle className="h-12 w-12 text-zinc-300 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900">Failed to load rentals</h3>
        <p className="text-zinc-500 max-w-sm">
          We encountered an error retrieving your lease agreements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Rentals</h1>
          <p className="text-sm text-zinc-500">
             Track your active lease agreements and warehouse usage.
          </p>
        </div>
        <Link
          to="/dashboard/warehouses/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-500/20 transition-transform hover:scale-105 hover:bg-zinc-800 active:scale-95"
        >
          <Search size={16} />
          Browse Warehouses
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by location or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredRents?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
           <Building2 className="h-10 w-10 text-zinc-300 mb-2" />
           <p className="text-zinc-500 font-medium">You don't have any active rentals yet.</p>
           <Link to="/dashboard/warehouses/" className="mt-2 text-rose-600 font-semibold hover:underline">
             Find a warehouse to rent
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRents.map((rent) => (
              <RentCard key={rent.rent_id} rent={rent} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}