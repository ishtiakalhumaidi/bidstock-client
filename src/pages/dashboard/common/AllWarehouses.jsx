import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Search,
  MapPin,
  Maximize,
  Building2,
  Calendar,
  X,
  Loader2,
  Filter,
  CreditCard,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/auth.api";

// --- Helper: Calculate Days ---
const getDaysDifference = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays; // Minimum 1 day if dates are the same
};

// --- 1. Rent Modal with Payment Step ---
const RentModal = ({ warehouse, isOpen, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState("details"); // 'details' | 'payment'

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  // Watch dates to calculate price dynamically
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Calculate Financials
  const days = getDaysDifference(startDate, endDate);
  const rentCost = days * warehouse.price;
  const serviceFee = rentCost * 0.05; // 5% fee
  const totalAmount = rentCost + serviceFee;

  // Transaction Mutation
  const transactionMutation = useMutation({
    mutationFn: (rentData) => {
      return api.post("/transactions", {
        bid_id:null,
        from_role: "seller",
        from_id: user.user_id,
        to_role: "warehouse_owner",
        to_id: warehouse.owner_id,
        transaction_type: "payment",
        amount: totalAmount.toFixed(2),
        status: "completed",
        payment_method: "credit_card",
        reference_id: `RENT-${warehouse.warehouse_id}-${Date.now()}`,
      });
    },
  });

  // Rent Mutation
  const rentMutation = useMutation({
    mutationFn: (data) => {
      return api.post("/rents", {
        seller_id: user.user_id,
        warehouse_id: warehouse.warehouse_id,
        start_date: data.start_date,
        end_date: data.end_date, // Must exist for calculation
      });
    },
    onSuccess: () => {
      alert("Payment successful & Warehouse rented!");
      queryClient.invalidateQueries(["all-warehouses"]);
      reset();
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to process rental.");
    },
  });

  const onSubmit = async (data) => {
    try {
      // 1. Create Transaction Record
      await transactionMutation.mutateAsync(data);

      // 2. Create Rent Record (Only if transaction succeeds)
      rentMutation.mutate(data);
    } catch (error) {
      console.error(error);
      alert("Transaction Failed. Rent was not created.");
    }
  };

  if (!isOpen) return null;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-zinc-900">
            {step === "details" ? "Rental Details" : "Payment"}
          </h3>
          <button onClick={onClose}>
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {step === "details" ? (
            <>
              {/* Warehouse Info */}
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                <MapPin size={16} /> {warehouse.location}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    {...register("start_date", { required: true })}
                    className="w-full border border-zinc-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={startDate || today}
                    {...register("end_date", { required: true })}
                    className="w-full border border-zinc-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Financial Summary */}
              {startDate && endDate && (
                <div className="bg-zinc-50 p-4 rounded-xl space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Duration</span>
                    <span className="font-semibold">{days} Days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Rate per Day</span>
                    <span className="font-semibold">${warehouse.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal Rent</span>
                    <span className="font-semibold">
                      ${rentCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Service Fee (5%)</span>
                    <span className="font-semibold">
                      ${serviceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-zinc-900 text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep("payment")}
                disabled={!startDate || !endDate}
                className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl mt-2 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                Proceed to Payment
              </button>
            </>
          ) : (
            <>
              {/* Payment UI */}
              <div className="space-y-3">
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-blue-50 border-blue-200">
                  <CreditCard className="text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Credit Card ending in 4242
                    </p>
                    <p className="text-xs text-blue-600">Expires 12/25</p>
                  </div>
                </div>
                <div className="text-center py-2">
                  <span className="text-zinc-500 text-sm">Amount to Pay:</span>
                  <div className="text-2xl font-bold text-zinc-900">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  Payment will be processed securely via Stripe (Mock).
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 border border-zinc-200 font-semibold rounded-xl hover:bg-zinc-50 text-zinc-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    transactionMutation.isPending || rentMutation.isPending
                  }
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {transactionMutation.isPending || rentMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Processing...
                    </>
                  ) : (
                    `Confirm Pay`
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

// --- 2. Warehouse Card Component ---
const WarehouseCard = ({ warehouse, onRent }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const statusConfig = {
    available: { color: "bg-emerald-100 text-emerald-700", label: "Available" },
    booked: { color: "bg-blue-100 text-blue-700", label: "Booked" },
    maintenance: { color: "bg-amber-100 text-amber-700", label: "Maintenance" },
  };

  const status = statusConfig[warehouse.status] || statusConfig.available;

  return (
    <div className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col h-full">
      {/* Visual Header */}
      <div className="h-32 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 flex flex-col justify-between relative">
        <div className="flex justify-between items-start">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-rose-600">
            <Building2 size={20} />
          </div>
          <span className="bg-white/90 backdrop-blur text-rose-600 text-sm font-bold px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
            {formatPrice(warehouse.price)}{" "}
            <span className="text-xs font-normal text-zinc-500">/day</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3
            className="font-bold text-zinc-900 text-lg mb-1 truncate"
            title={warehouse.location}
          >
            {warehouse.location}
          </h3>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2">
            <Maximize size={16} className="text-zinc-400" />
            <span>{warehouse.capacity.toLocaleString()} sq ft</span>
          </div>
          <div className="mt-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-100">
          <button
            onClick={() => onRent(warehouse)}
            disabled={warehouse.status !== "available"}
            className="w-full py-2.5 bg-zinc-900 hover:bg-rose-600 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
          >
            <Calendar size={16} />
            {warehouse.status === "available" ? "Rent Space" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Page Component (Default Export) ---
export default function AllWarehouses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const {
    data: warehouses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-warehouses"],
    queryFn: async () => {
      const res = await api.get("/warehouses");
      return res.data.data;
    },
  });

  const filteredWarehouses = warehouses?.filter((w) =>
    w.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={32} />
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Failed to load warehouses.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Warehouse Marketplace
          </h1>
          <p className="text-zinc-500 text-sm">
            Find and rent storage space for your inventory.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-zinc-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by location..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-zinc-600 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWarehouses?.map((warehouse) => (
          <WarehouseCard
            key={warehouse.warehouse_id}
            warehouse={warehouse}
            onRent={setSelectedWarehouse}
          />
        ))}
      </div>

      {/* Rent Modal */}
      <AnimatePresence>
        {selectedWarehouse && (
          <RentModal
            warehouse={selectedWarehouse}
            isOpen={!!selectedWarehouse}
            onClose={() => setSelectedWarehouse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
