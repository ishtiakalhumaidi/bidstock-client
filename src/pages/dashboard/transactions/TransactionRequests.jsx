import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  CreditCard, Lock, Loader2, X, AlertCircle, ShoppingBag, ArrowRight 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/auth.api';
import { useAuth } from '../../../hooks/useAuth';


// --- PAYMENT MODAL ---
const PaymentModal = ({ transaction, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => {
      // Confirm the transaction
      return api.put(`/transactions/${transaction.transaction_id}`, {
        status: 'completed',
        payment_method: 'credit_card', 
        reference_id: `TX-${Date.now()}-PAID` 
      });
    },
    onSuccess: () => {
      alert("Payment Successful! Item secured.");
      queryClient.invalidateQueries(['my-transactions']);
      onClose();
    },
    onError: (err) => alert(err.response?.data?.message || "Payment Failed")
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center p-1">
                {transaction.image_url ? (
                  <img src={transaction.image_url} className="h-full w-full object-cover rounded"/>
                ) : (
                  <ShoppingBag size={20} className="text-zinc-400"/>
                )}
             </div>
             <div>
               <h3 className="font-bold text-zinc-900 line-clamp-1">{transaction.product_name || "Payment Request"}</h3>
               <p className="text-xs text-zinc-500">Ref: {transaction.reference_id}</p>
             </div>
          </div>
          <button onClick={onClose}><X size={20} className="text-zinc-400" /></button>
        </div>

        <form onSubmit={handleSubmit(mutation.mutate)} className="p-6 space-y-5">
          
          {/* Amount Display */}
          <div className="text-center py-4 bg-blue-50 rounded-xl border border-blue-100">
             <p className="text-sm text-blue-600 font-medium mb-1">Total Amount</p>
             <p className="text-3xl font-bold text-blue-900">${transaction.amount}</p>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  {...register("card_number", { required: true, minLength: 16 })}
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              {errors.card_number && <p className="text-xs text-red-500">Invalid Card Number</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Expiry</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  maxLength={5}
                  {...register("expiry", { required: true })}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input 
                    type="password" 
                    placeholder="123"
                    maxLength={4}
                    {...register("cvc", { required: true })}
                    className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="JOHN DOE"
                  {...register("name", { required: true })}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg shadow-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Lock size={16} />}
            Pay Securely
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function TransactionRequests() {
  const { user } = useAuth();
  const [selectedTx, setSelectedTx] = useState(null);

  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['my-transactions'],
    queryFn: async () => {
      const res = await api.get('/transactions/my-transactions');
      return res.data.data;
    }
  });

  // Filter: Show only Pending Payments where I am the Payer (From)
  const pendingRequests = transactions?.filter(tx => 
    tx.status === 'pending' && 
    tx.transaction_type === 'payment' && 
    tx.from_id === user.user_id && 
    tx.from_role === user.role
  );

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load requests.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Payment Requests</h1>
        <p className="text-zinc-500 text-sm">Review and complete your pending purchases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {pendingRequests?.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-zinc-50 rounded-2xl border-dashed border-2 border-zinc-200">
                <CreditCard className="mx-auto h-12 w-12 text-zinc-300 mb-2"/>
                <p className="text-zinc-500 font-medium">No pending payments.</p>
             </div>
          ) : (
            pendingRequests.map((tx) => (
              <motion.div 
                key={tx.transaction_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                   <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                     Action Required
                   </span>
                   <span className="text-xs text-zinc-400 font-mono">#{tx.transaction_id}</span>
                </div>

                {/* Product Details */}
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-16 w-16 bg-zinc-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100">
                      {tx.image_url ? (
                        <img src={tx.image_url} alt="" className="h-full w-full object-cover"/>
                      ) : (
                        <ShoppingBag className="text-zinc-300" />
                      )}
                   </div>
                   <div>
                      <h3 className="font-bold text-zinc-900 line-clamp-1">{tx.product_name || "Unknown Item"}</h3>
                      <p className="text-sm text-zinc-500">Seller: {tx.counterparty_name || "Unknown"}</p>
                   </div>
                </div>

                {/* Footer / Action */}
                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                   <div>
                      <p className="text-xs text-zinc-400 uppercase font-bold">Total</p>
                      <p className="text-xl font-bold text-zinc-900">${tx.amount}</p>
                   </div>
                   <button 
                     onClick={() => setSelectedTx(tx)}
                     className="px-5 py-2.5 bg-zinc-900 hover:bg-rose-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-zinc-200 hover:shadow-rose-500/20"
                   >
                     Pay Now <ArrowRight size={14} />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {selectedTx && (
        <PaymentModal 
          transaction={selectedTx} 
          isOpen={!!selectedTx} 
          onClose={() => setSelectedTx(null)} 
        />
      )}
    </div>
  );
}