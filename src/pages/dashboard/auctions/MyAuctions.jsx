import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Clock, Eye, CheckCircle, X, Loader2, DollarSign, User 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';



const OffersModal = ({ bid, isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['bid-offers', bid.bid_id],
    queryFn: async () => {
      const res = await api.get(`/offers/bid/${bid.bid_id}`);
      return res.data.data;
    },
    enabled: isOpen
  });

  // Accept Mutation
  const acceptMutation = useMutation({
    mutationFn: (offerId) => api.post(`/offers/${offerId}/accept`),
    onSuccess: () => {
      alert("Offer accepted! Transaction created.");
      queryClient.invalidateQueries(['my-bids']); 
      onClose();
    },
    onError: (err) => alert(err.response?.data?.message || "Failed to accept")
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div>
            <h3 className="font-bold text-zinc-900">Manage Offers</h3>
            <p className="text-xs text-zinc-500">Item: {bid.product_name}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-rose-500"/></div>
          ) : offers?.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No offers yet.</div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.offer_id} className="flex justify-between items-center p-4 border border-zinc-100 rounded-xl hover:border-zinc-200 transition-all bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                      {offer.buyer_image ? <img src={offer.buyer_image} className="h-full w-full rounded-full object-cover"/> : <User size={18}/>}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-lg">${offer.offered_price}</p>
                      <p className="text-xs text-zinc-500">by {offer.buyer_name}</p>
                    </div>
                  </div>
                  
                  {offer.status === 'pending' && bid.status === 'open' ? (
                    <button 
                      onClick={() => {
                        if(window.confirm(`Accept offer of $${offer.offered_price}? This will close the auction.`)) {
                          acceptMutation.mutate(offer.offer_id);
                        }
                      }}
                      disabled={acceptMutation.isPending}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {acceptMutation.isPending ? <Loader2 className="animate-spin h-4 w-4"/> : <CheckCircle size={16}/>}
                      Accept
                    </button>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                      ${offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {offer.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function MyAuctions() {
  const [selectedBid, setSelectedBid] = useState(null);
  
  const { data: myBids, isLoading, isError } = useQuery({
    queryKey: ['my-bids'],
    queryFn: async () => {
      const res = await api.get('/bids/my-bids');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={32}/></div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load auctions.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Auctions</h1>
          <p className="text-zinc-500 text-sm">Review offers and close deals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {myBids?.length === 0 ? (
           <div className="text-center py-20 bg-zinc-50 rounded-xl border border-dashed text-zinc-400">
             You haven't started any auctions yet.
           </div>
        ) : (
          myBids.map((bid) => (
            <div key={bid.bid_id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                  {bid.image_url ? <img src={bid.image_url} className="h-full w-full object-cover"/> : <Gavel className="m-auto text-zinc-300"/>}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">{bid.product_name}</h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${bid.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {bid.status === 'open' ? 'Active' : 'Closed'}
                    </span>
                    <span>Base: ${bid.base_price}</span>
                    <span>Highest: <span className="text-rose-600 font-bold">${bid.highest_bid || 0}</span></span>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-center px-4 border-r border-zinc-100">
                   <span className="block text-2xl font-bold text-zinc-900">{bid.offer_count}</span>
                   <span className="text-xs text-zinc-500 uppercase font-bold">Offers</span>
                </div>
                
                <button 
                  onClick={() => setSelectedBid(bid)}
                  className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={18} /> Manage Offers
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedBid && (
        <OffersModal 
          bid={selectedBid} 
          isOpen={!!selectedBid} 
          onClose={() => setSelectedBid(null)} 
        />
      )}
    </div>
  );
}