import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Clock, MapPin, Gavel, User, AlertCircle, Loader2, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/auth.api';


export default function BidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: bid, isLoading, isError } = useQuery({
    queryKey: ['bid', id],
    queryFn: async () => {
      const res = await api.get(`/bids/${id}`);
      return res.data.data;
    }
  });

  // 2. Offer Mutation
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const mutation = useMutation({
    mutationFn: (data) => api.post('/offers', {
      bid_id: id,
      offered_price: parseFloat(data.amount)
    }),
    onSuccess: () => {
      alert("Offer placed successfully!");
      queryClient.invalidateQueries(['bid', id]); // Refresh current price
      reset();
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to place offer");
    }
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={40}/></div>;
  if (isError) return <div className="text-center p-20 text-red-500">Bid not found.</div>;

  const currentPrice = bid.highest_bid ? parseFloat(bid.highest_bid) : parseFloat(bid.base_price);
  const isOwner = user?.user_id === bid.seller_id;
  const isBuyer = user?.role === 'buyer';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Auctions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COL: Image & Description */}
        <div className="space-y-6">
          <div className="aspect-[4/3] bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-sm relative">
             {bid.image_url ? (
               <img src={bid.image_url} alt={bid.product_name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">No Image</div>
             )}
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
                <Clock size={14} className="text-rose-600"/> 
                Ends: {new Date(bid.end_time).toLocaleDateString()}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h3 className="text-lg font-bold text-zinc-900 mb-3">Description</h3>
             <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
               {bid.description || "No description provided."}
             </p>
          </div>
        </div>

        {/* RIGHT COL: Bidding & Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
             <div className="mb-6">
               <h1 className="text-3xl font-black text-zinc-900 mb-2">{bid.product_name}</h1>
               <div className="flex items-center gap-2 text-zinc-500">
                  <User size={16} /> <span className="font-medium">{bid.seller_name}</span>
               </div>
             </div>

             <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 mb-8">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Highest Bid</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-black text-rose-600">${currentPrice.toLocaleString()}</span>
                   <span className="text-sm text-zinc-500 font-medium">USD</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">Base Price: ${bid.base_price}</p>
             </div>

             {/* Bidding Form */}
             {isBuyer ? (
               <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-zinc-700">Place Your Bid</label>
                   <div className="relative">
                     <span className="absolute left-4 top-3.5 text-zinc-400 font-bold">$</span>
                     <input 
                       type="number" 
                       step="0.01"
                       placeholder={(currentPrice + 10).toFixed(2)}
                       {...register("amount", { 
                         required: "Amount is required",
                         validate: val => parseFloat(val) > currentPrice || "Bid must be higher than current price"
                       })}
                       className="w-full pl-8 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none font-bold text-lg"
                     />
                   </div>
                   {errors.amount && (
                     <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
                       <AlertCircle size={12}/> {errors.amount.message}
                     </p>
                   )}
                 </div>

                 <button 
                   type="submit" 
                   disabled={mutation.isPending}
                   className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg shadow-zinc-900/20 transition-all flex items-center justify-center gap-2"
                 >
                   {mutation.isPending ? <Loader2 className="animate-spin"/> : <Gavel size={20} />}
                   Confirm Bid
                 </button>
                 <p className="text-xs text-center text-zinc-400">
                   By clicking confirm, you commit to buying this item if you win.
                 </p>
               </form>
             ) : isOwner ? (
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl font-medium text-center">
                   You are the seller of this item.
                </div>
             ) : (
                <div className="p-4 bg-zinc-100 text-zinc-500 rounded-xl font-medium text-center">
                   Log in as a Buyer to bid.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}