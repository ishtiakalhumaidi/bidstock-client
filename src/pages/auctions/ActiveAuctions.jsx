import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Gavel, Clock, Calendar, Search, X, Loader2, Tag, AlertCircle 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';


const PlaceOfferModal = ({ bid, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post('/offers', {
      bid_id: bid.bid_id,
      offered_price: parseFloat(data.amount)
    }),
    onSuccess: () => {
      alert("Offer placed successfully!");
      queryClient.invalidateQueries(['active-bids']);
      reset();
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to place offer");
    }
  });

  if (!isOpen) return null;

  const currentPrice = bid.highest_bid ? parseFloat(bid.highest_bid) : parseFloat(bid.base_price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Place Your Bid</h3>
            <p className="text-sm text-zinc-500">{bid.product_name}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-zinc-400 hover:text-zinc-600" /></button>
        </div>
        <form onSubmit={handleSubmit(mutation.mutate)} className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
             <span className="text-sm text-blue-700 font-medium">Current Price</span>
             <span className="text-2xl font-bold text-blue-900">${currentPrice}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Your Offer ($)</label>
            <input 
              type="number" 
              step="0.01"
              {...register("amount", { 
                required: "Amount is required",
                validate: value => parseFloat(value) > currentPrice || "Offer must be higher than current price"
              })}
              className="w-full p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-lg"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10}/> {errors.amount.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-200"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Gavel size={18} />}
            Confirm Bid
          </button>
        </form>
      </motion.div>
    </div>
  );
};


export default function ActiveAuctions() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('active');
  const [selectedBid, setSelectedBid] = useState(null);
  
  const { data: bids, isLoading, isError } = useQuery({
    queryKey: ['active-bids'],
    queryFn: async () => {
      const res = await api.get('/bids');
      return res.data.data;
    }
  });

  console.log(bids);

  const now = new Date();
  const filteredBids = bids?.filter(bid => {
    const start = new Date(bid.start_time);
    const end = new Date(bid.end_time);
    
    if (filter === 'active') {
      return start <= now && end > now;
    } else {
      return start > now;
    }
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
    });
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={32}/></div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load auctions.</div>;

  return (
    <div className="space-y-12 max-w-[1180px] mx-auto my-7">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Gavel className="text-rose-600" /> Auction Floor
          </h1>
          <p className="text-zinc-500 text-sm">Real-time bidding on verified inventory.</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          <button 
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${filter === 'active' ? 'bg-rose-100 text-rose-700' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <div className={`h-2 w-2 rounded-full ${filter === 'active' ? 'bg-rose-500 animate-pulse' : 'bg-zinc-300'}`} />
            Live Now
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${filter === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Calendar size={14} />
            Upcoming
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredBids?.length === 0 ? (
             <div className="col-span-full py-24 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                <div className="mx-auto h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                    <Gavel size={32} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No {filter} auctions</h3>
                <p className="text-zinc-500">Check back later or switch tabs.</p>
             </div>
          ) : (
            filteredBids.map((bid) => (
              <motion.div 
                key={bid.bid_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="h-56 bg-zinc-100 relative overflow-hidden">
                  {bid.image_url ? (
                    <img src={bid.image_url} alt={bid.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <Tag size={48} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border flex items-center gap-1.5
                      ${filter === 'active' ? 'bg-white/90 text-rose-600 border-rose-100' : 'bg-white/90 text-blue-600 border-blue-100'}`}>
                      {filter === 'active' ? <Clock size={12} className="animate-pulse"/> : <Calendar size={12}/>}
                      {filter === 'active' ? `Ends: ${formatDate(bid.end_time)}` : `Starts: ${formatDate(bid.start_time)}`}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-zinc-900 mb-1 line-clamp-1" title={bid.product_name}>
                      {bid.product_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                       <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 font-medium">Seller</span>
                       {bid.seller_name}
                    </div>
                  </div>

                  {/* Price Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Starting Bid</p>
                      <p className="font-semibold text-zinc-600">${bid.base_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Current High</p>
                      <p className="font-bold text-zinc-900 text-lg">
                        ${bid.highest_bid ? bid.highest_bid : bid.base_price}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {filter === 'active' ? (
                      <button 
                        onClick={() => setSelectedBid(bid)}
                        disabled={user?.role !== 'buyer'}
                        className="w-full py-3.5 bg-zinc-900 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:-translate-y-1"
                      >
                        <Gavel size={18} /> 
                        {user?.role === 'buyer' ? 'Place Bid' : 'Login as Buyer'}
                      </button>
                    ) : (
                      <button disabled className="w-full py-3.5 bg-zinc-50 text-zinc-400 font-bold rounded-xl cursor-not-allowed border border-zinc-200 flex items-center justify-center gap-2">
                        <Clock size={18} /> Not Started
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Offer Modal */}
      {selectedBid && (
        <PlaceOfferModal 
          bid={selectedBid} 
          isOpen={!!selectedBid} 
          onClose={() => setSelectedBid(null)} 
        />
      )}
    </div>
  );
}