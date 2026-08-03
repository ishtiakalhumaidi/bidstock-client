import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ShieldCheck, ArrowLeft, Lock, Clock, XCircle, Loader2, AlertCircle, 
  CreditCard, CheckCircle2, ChevronRight 
} from "lucide-react";
import toast from "react-hot-toast";
import { getSingleTransaction, payTransaction, updateTransaction } from "../../../api/transactions.api";
import { useAuth } from "../../../hooks/useAuth";
import { confirmAction } from "../../../lib/confirm";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Field";

export default function Checkout() {
  const { transaction_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); 

  // --- Card Payment State ---
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const { data: txData, isLoading, isError } = useQuery({
    queryKey: ["transactions", transaction_id],
    queryFn: () => getSingleTransaction(transaction_id),
    enabled: !!transaction_id, 
  });

  const rawData = txData?.data;
  const transaction = Array.isArray(rawData) ? rawData[0] : rawData;

  const payMutation = useMutation({
    mutationFn: (paymentPayload) => payTransaction(transaction_id, paymentPayload),
    onSuccess: () => {
      toast.success("Payment verified and ledger updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      navigate("/dashboard/my-transactions");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Payment sequence failed"),
  });

  const cancelMutation = useMutation({
    mutationFn: () => updateTransaction(transaction_id, { status: "cancelled" }), 
    onSuccess: () => {
      toast.success("Transaction cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate("/dashboard/my-transactions");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not cancel transaction"),
  });

  const handleCancel = async () => {
    const ok = await confirmAction({
      title: "Abort Transaction?",
      text: "Are you sure you want to cancel this payment? The seller will be notified and the asset will remain with them.",
      confirmText: "Yes, Cancel It",
      danger: true,
    });
    if (ok) cancelMutation.mutate();
  };

  const executeManualPayment = () => {
    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      toast.error("Please fill in all credit card details to proceed.");
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 15) {
      toast.error("Please enter a valid card number.");
      return;
    }

    // Auto-generate a simulated Stripe-like token/transaction ID for the backend
    const simulatedTrxId = `ch_${Math.random().toString(36).substring(2, 15)}`;
    const last4 = cardNumber.slice(-4);

    // Submit the simulated data to your backend API
    payMutation.mutate({
      payment_method: "card",
      account_reference: last4,
      external_transaction_id: simulatedTrxId
    });
  };

  // Format card number with spaces for better UX
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue.substring(0, 19)); // Limit to 16 digits + 3 spaces
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(value.substring(0, 5));
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-ink-muted">
        <Loader2 size={36} className="animate-spin mb-4 text-teal" />
        <p className="font-mono text-sm uppercase tracking-widest text-ink-soft">
          {!user ? "Authenticating Session..." : "Syncing Ledger Data..."}
        </p>
      </div>
    );
  }
  
  if (isError || !transaction || transaction.status !== 'pending') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white border border-line rounded-card shadow-sm">
        <div className="h-16 w-16 bg-paper-dim border border-line rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-ink-soft" />
        </div>
        <h2 className="text-xl font-display font-semibold text-ink">Transaction Unavailable</h2>
        <p className="text-ink-soft mt-2">This payment has already been processed, cancelled, or is invalid.</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate('/dashboard/my-transactions')}>
          Return to Ledger
        </Button>
      </div>
    );
  }

  const isPayer = String(user.user_id) === String(transaction.from_id);

  if (!isPayer) {
    return (
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Return to ledger
        </button>

        <Card className="text-center py-16 px-6">
          <div className="h-16 w-16 bg-amber-soft border border-amber/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-amber-dark" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink">Awaiting Buyer Payment</h2>
          <p className="text-ink-soft mt-3 max-w-md mx-auto">
            This transaction is locked and awaiting fund transfer from <strong>{transaction.counterparty_name || "the buyer"}</strong>. 
            No action is required from you at this time.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Save for later
      </button>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
          <Lock size={12} className="text-teal" /> Secure Checkout
        </p>
        <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Finalize Acquisition</h1>
      </div>

      <Card className="overflow-hidden shadow-md border-ink/10">
        <div className="p-6 md:p-8 flex flex-col items-center border-b border-line bg-gradient-to-b from-paper-dim/50 to-transparent">
          <p className="text-sm font-medium text-ink-soft mb-2">Amount Due</p>
          <p className="font-mono font-tabular font-bold text-5xl text-ink tracking-tight">
            ${Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4 text-sm bg-paper-dim/30 p-5 rounded-xl border border-line shadow-sm">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-ink-soft">Target Asset</span>
              <span className="font-medium text-ink text-right max-w-[200px] truncate">{transaction.product_name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-ink-soft">Recipient / Seller</span>
              <span className="font-medium text-ink">{transaction.to_name}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-ink-soft">Ledger Reference</span>
              <span className="font-mono text-[11px] bg-white border border-line px-2 py-1 rounded text-ink-muted tracking-wider">
                {transaction.reference_id || `TXN-${transaction.transaction_id}`}
              </span>
            </div>
          </div>

          {/* --- SECURE PAYMENT GATEWAY --- */}
          {!showPaymentGateway ? (
            <div className="flex flex-col gap-3 pt-4 border-t border-line border-dashed">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full h-12 text-base shadow-sm" 
                icon={ChevronRight}
                onClick={() => setShowPaymentGateway(true)}
              >
                Enter Payment Details
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full h-12 text-ink-soft hover:text-red hover:bg-red-soft transition-colors" 
                icon={XCircle}
                loading={cancelMutation.isPending}
                onClick={handleCancel}
              >
                Cancel Transaction
              </Button>
            </div>
          ) : (
            <div className="pt-6 border-t border-line border-dashed animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={20} className="text-ink" />
                <h3 className="font-display font-semibold text-lg text-ink">Credit / Debit Card</h3>
              </div>

              {/* Realistic Card Entry Form */}
              <div className="space-y-4 bg-paper-dim/50 p-6 rounded-xl border border-line">
                <Input 
                  label="Name on Card"
                  placeholder="e.g. Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
                
                <Input 
                  label="Card Number"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    required
                  />
                  <Input 
                    label="CVC"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 text-[10px] uppercase tracking-widest text-ink-muted">
                  <ShieldCheck size={14} className="text-teal" /> 
                  256-bit Encrypted Transaction
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline"
                  className="w-1/3"
                  onClick={() => setShowPaymentGateway(false)}
                  disabled={payMutation.isPending}
                >
                  Back
                </Button>
                <Button 
                  variant="primary"
                  className="w-2/3 shadow-sm"
                  icon={CheckCircle2}
                  loading={payMutation.isPending}
                  onClick={executeManualPayment}
                >
                  Pay ${Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}