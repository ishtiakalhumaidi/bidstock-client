import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, CreditCard, ShieldCheck, ArrowRight, MapPin, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getSingleWarehouse } from "../../../api/warehouse.api";
import { addRent } from "../../../api/rents.api";
import Button from "../../../components/ui/Button";

// Helper: Calculate difference in days between two YYYY-MM-DD date strings
const calculateDays = (startStr, endStr) => {
  if (!startStr || !endStr) return 0;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function RentWarehouse() {
  const { warehouse_id } = useParams();
  const navigate = useNavigate();

  // Get today's date formatted as YYYY-MM-DD for input min constraint
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Default dates: Start Today, End 3 days from today
  const defaultEndStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  }, []);

  const [dates, setDates] = useState({
    start: todayStr,
    end: defaultEndStr,
  });

  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  // 1. Fetch live facility rate per day
  const { data: warehouseResponse, isLoading: isWarehouseLoading } = useQuery({
    queryKey: ["warehouse", warehouse_id],
    queryFn: () => getSingleWarehouse(warehouse_id),
    enabled: !!warehouse_id,
  });

  const warehouse = warehouseResponse?.data ?? warehouseResponse;
  const baseRate = Number(warehouse?.price_per_day ?? 0);

  // 2. Real-time dynamic math calculations
  const computedDays = useMemo(
    () => calculateDays(dates.start, dates.end),
    [dates.start, dates.end]
  );

  const subtotal = useMemo(
    () => baseRate * computedDays,
    [baseRate, computedDays]
  );

  const networkFee = useMemo(
    () => subtotal * 0.015,
    [subtotal]
  );

  const totalAuthorization = useMemo(
    () => subtotal + networkFee,
    [subtotal, networkFee]
  );

  // 3. Lease execution mutation
  const rentMutation = useMutation({
    mutationFn: (payload) => addRent(payload),
    onSuccess: () => {
      toast.success("Lease agreement executed and facility booked!");
      navigate("/dashboard/my-rents");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to execute lease");
    },
  });

  const handleExecution = (e) => {
    e.preventDefault();

    if (computedDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    // Process payment authorization payload to backend
    rentMutation.mutate({
      warehouse_id: Number(warehouse_id),
      start_date: dates.start,
      end_date: dates.end,
      payment_details: {
        card_holder: cardData.name,
        last_four: cardData.number.slice(-4),
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-ink">Execute Lease Agreement</h1>
        <p className="text-sm text-ink-soft mt-1">
          Configure parameters and verify financial clearing for Facility #{warehouse_id}
          {warehouse?.location && (
            <span className="inline-flex items-center gap-1 ml-2 font-mono text-xs text-ink-muted">
              <MapPin size={12} /> {warehouse.location}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Lease Parameters & Payment Capture */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Lease Parameters Form */}
          <section className="bg-white border border-line rounded-card p-6 shadow-sm">
            <h2 className="font-semibold text-ink flex items-center gap-2 mb-5">
              <Calendar size={18} className="text-amber-dark" /> Lease Parameters
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Start Date</label>
                <input 
                  type="date" 
                  min={todayStr}
                  className="w-full rounded-lg border border-line bg-paper-dim px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none transition-colors"
                  value={dates.start}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setDates((prev) => ({
                      start: newStart,
                      // Automatically adjust end date if start date surpasses it
                      end: prev.end && prev.end <= newStart ? "" : prev.end,
                    }));
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">End Date</label>
                <input 
                  type="date" 
                  min={dates.start || todayStr}
                  className="w-full rounded-lg border border-line bg-paper-dim px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none transition-colors"
                  value={dates.end}
                  onChange={(e) => setDates({ ...dates, end: e.target.value })}
                  required
                />
              </div>
            </div>

            {dates.start && dates.end && computedDays <= 0 && (
              <p className="mt-3 text-xs text-red flex items-center gap-1">
                <AlertCircle size={14} /> End date must be at least 1 day after the start date.
              </p>
            )}
          </section>

          {/* Financial Clearing */}
          <section className="bg-white border border-line rounded-card p-6 shadow-sm">
            <h2 className="font-semibold text-ink flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-teal" /> Financial Clearing
            </h2>
            
            <form id="lease-execution-form" onSubmit={handleExecution} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="Ishtiak Al Humaidi"
                  className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className="w-full font-mono rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full font-mono rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    maxLength="4"
                    className="w-full font-mono rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    required
                  />
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Dynamic Transaction Summary */}
        <div className="lg:col-span-5">
          <div className="bg-paper-dim border border-line rounded-card p-6 sticky top-6 shadow-sm">
            <h3 className="font-semibold text-ink mb-4">Transaction Payload</h3>
            
            <div className="space-y-3 mb-6 font-mono text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Rate Matrix</span>
                <span>
                  {isWarehouseLoading ? "..." : `$${baseRate.toLocaleString()}/day`}
                </span>
              </div>

              {/* DYNAMIC DURATION VECTOR */}
              <div className="flex justify-between text-ink-soft">
                <span>Duration Vector</span>
                <span className="font-semibold text-ink">
                  {computedDays} {computedDays === 1 ? "day" : "days"}
                </span>
              </div>

              {/* DYNAMIC SUBTOTAL */}
              <div className="flex justify-between text-ink-soft border-t border-line-strong pt-3">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {/* DYNAMIC NETWORK FEE */}
              <div className="flex justify-between text-ink-soft">
                <span>Network Fee (1.5%)</span>
                <span>${networkFee.toFixed(2)}</span>
              </div>

              {/* DYNAMIC TOTAL AUTHORIZATION */}
              <div className="flex justify-between text-ink font-semibold border-t border-line-strong pt-3 text-base">
                <span>Total Authorization</span>
                <span className="text-amber-dark">
                  ${totalAuthorization.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="lease-execution-form" 
              variant="accent" 
              className="w-full"
              loading={rentMutation.isPending}
              disabled={computedDays <= 0 || isWarehouseLoading}
            >
              {rentMutation.isPending ? "Clearing Transaction..." : "Authorize & Execute"} <ArrowRight size={16} className="ml-1" />
            </Button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck size={14} /> 256-bit TLS encryption active
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}