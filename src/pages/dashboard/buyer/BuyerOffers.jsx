import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Clock, CheckCircle, XCircle, ShoppingBag, Loader2, ArrowRight, Timer, Receipt
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/auth.api';
import { useNavigate } from 'react-router';

export default function BuyerOffers() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending'); // 'pending' | 'accepted' | 'rejected'

  const { data: offers, isLoading, isError } = useQuery({
    queryKey: ['my-offers'],
    queryFn: async () => {
      const res = await api.get('/offers/my-offers');
      return res.data.data;
    }
  });

  const filteredOffers = offers?.filter(offer => offer.status === filter);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={32}/></div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load offers.</div>;

  const tabs = [
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'accepted', label: 'Won / Accepted', icon: CheckCircle },
    { id: 'rejected', label: 'Lost', icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">My Offers</h1>
        <p className="text-zinc-500 text-sm">Track your active bids and purchase history.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white border border-zinc-200 rounded-xl w-fit shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.id 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOffers?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-zinc-50 rounded-2xl border-dashed border-2 border-zinc-200"
            >
              <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300 mb-2"/>
              <p className="text-zinc-500 font-medium">No {filter} offers found.</p>
            </motion.div>
          ) : (
            filteredOffers.map((offer) => (
              <motion.div
                key={offer.offer_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                {/* Card Header */}
                <div className="flex h-32 bg-zinc-100 relative">
                   {offer.image_url ? (
                     <img src={offer.image_url} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-zinc-300"><Gavel size={32}/></div>
                   )}
                   <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md border 
                     ${offer.status === 'accepted' ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200' : 
                       offer.status === 'rejected' ? 'bg-red-100/90 text-red-700 border-red-200' : 
                       'bg-amber-100/90 text-amber-700 border-amber-200'}`}>
                     {offer.status}
                   </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                   <div className="mb-4">
                      <h3 className="font-bold text-zinc-900 text-lg line-clamp-1">{offer.product_name}</h3>
                      <p className="text-xs text-zinc-500">Seller: {offer.seller_name}</p>
                   </div>

                   <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Your Offer</p>
                        <p className="text-xl font-bold text-zinc-900">${offer.offered_price}</p>
                      </div>
                      {offer.status === 'pending' && (
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-zinc-400 uppercase">Ends</p>
                           <div className="flex items-center gap-1 text-sm font-medium text-zinc-600">
                              <Timer size={14} className="text-rose-500" />
                              {new Date(offer.end_time).toLocaleDateString()}
                           </div>
                        </div>
                      )}
                      {/* Show Paid Status if available */}
                      {offer.status === 'accepted' && offer.payment_status === 'completed' && (
                         <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                               <CheckCircle size={10} /> Paid
                            </span>
                         </div>
                      )}
                   </div>

                   {/* Action Area */}
                   {offer.status === 'accepted' ? (
                     offer.payment_status === 'completed' ? (
                        <button disabled className="w-full py-2.5 bg-zinc-100 text-zinc-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-zinc-200">
                          <Receipt size={16} /> Order Completed
                        </button>
                     ) : (
                        <button 
                          onClick={() => navigate('/dashboard/transactions-requests')}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                        >
                          Go to Payment <ArrowRight size={16} />
                        </button>
                     )
                   ) : offer.status === 'pending' ? (
                     <button disabled className="w-full py-2.5 bg-zinc-100 text-zinc-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                       <Clock size={16} /> Awaiting Seller
                     </button>
                   ) : (
                     <button disabled className="w-full py-2.5 bg-zinc-50 text-zinc-400 font-medium rounded-xl cursor-not-allowed text-sm">
                       Offer Rejected
                     </button>
                   )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}