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
  AlertCircle,
  X,
  DollarSign,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/auth.api';

// --- UTILS ---
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

// --- RENT DETAILS MODAL ---
const RentDetailsModal = ({ rent, isOpen, onClose }) => {
  if (!isOpen || !rent) return null;

  // Calculate Days & Cost
  const start = new Date(rent.start_date);
  const end = rent.end_date ? new Date(rent.end_date) : new Date();
  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  // Assuming 'warehouse_price' is usually fetched. If not in current query, 
  // you might need to rely on what is available or fetch single rent details.
  // Based on your previous files, getMyRents returns limited data. 
  // Ideally, fetch single rent or ensure 'price' is in the list query.
  // For now, let's assume we can display duration clearly.
  
  // Status Colors
  const statusColors = {
    active: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    pending: 'text-amber-600 bg-amber-50 border-amber-100',
    completed: 'text-zinc-600 bg-zinc-50 border-zinc-100',
    cancelled: 'text-red-600 bg-red-50 border-red-100',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Lease Agreement</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">ID: #{rent.rent_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusColors[rent.status] || statusColors.completed}`}>
             {rent.status === 'active' && <CheckCircle size={24} />}
             {rent.status === 'cancelled' && <XCircle size={24} />}
             {(rent.status === 'completed' || rent.status === 'pending') && <Clock size={24} />}
             <div>
                <p className="font-bold text-lg capitalize">{rent.status}</p>
                <p className="text-xs opacity-80">
                  {rent.status === 'active' ? 'This lease is currently valid.' : 'This agreement is no longer active.'}
                </p>
             </div>
          </div>

          {/* Warehouse Info */}
          <div className="space-y-3">
             <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
               <Building2 size={16} /> Facility Details
             </h4>
             <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
                <div className="flex justify-between">
                   <span className="text-zinc-500 text-sm">Location</span>
                   <span className="text-zinc-900 font-medium text-right">{rent.warehouse_location}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-zinc-500 text-sm">Capacity</span>
                   <span className="text-zinc-900 font-medium">{rent.warehouse_capacity?.toLocaleString()} items</span>
                </div>
             </div>
          </div>

          {/* Timeline & Duration */}
          <div className="space-y-3">
             <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
               <Calendar size={16} /> Timeline
             </h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-zinc-200 rounded-lg">
                   <span className="text-xs text-zinc-400 block mb-1">Start Date</span>
                   <span className="font-semibold text-emerald-600">{formatDate(rent.start_date)}</span>
                </div>
                <div className="p-3 border border-zinc-200 rounded-lg">
                   <span className="text-xs text-zinc-400 block mb-1">End Date</span>
                   <span className="font-semibold text-rose-600">{formatDate(rent.end_date)}</span>
                </div>
             </div>
             <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm text-center font-medium">
                Total Duration: {totalDays} Days
             </div>
          </div>

          {/* Owner / Contact Info */}
          <div className="space-y-3">
             <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
               <User size={16} /> Warehouse Owner
             </h4>
             <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
                <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                   <User size={24} />
                </div>
                <div className="space-y-1">
                   <p className="font-bold text-zinc-900">{rent.owner_name}</p>
                   <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Mail size={12}/> {rent.owner_email}</span>
                      {rent.owner_phone && <span className="flex items-center gap-1"><Phone size={12}/> {rent.owner_phone}</span>}
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
           <button onClick={onClose} className="px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors">
             Close Details
           </button>
        </div>
      </motion.div>
    </div>
  );
};

const RentCard = ({ rent, onOpenDetails }) => {
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
         
         <button 
           onClick={() => onOpenDetails(rent)}
           className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
         >
            View Details <ArrowRight size={14} />
         </button>
      </div>
    </motion.div>
  );
};


export default function MyRents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRent, setSelectedRent] = useState(null);

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
              <RentCard 
                key={rent.rent_id} 
                rent={rent} 
                onOpenDetails={setSelectedRent}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRent && (
          <RentDetailsModal 
            rent={selectedRent} 
            isOpen={!!selectedRent} 
            onClose={() => setSelectedRent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}