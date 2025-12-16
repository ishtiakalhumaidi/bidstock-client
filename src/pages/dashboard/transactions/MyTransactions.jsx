import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Loader2,
  CreditCard,
  Wallet,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/auth.api";

// --- Utility: Format Currency ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// --- Utility: Format Date ---
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MyTransactions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-transactions"],
    queryFn: async () => {
      const res = await api.get("/transactions/my-transactions");
      return res.data.data;
    },
  });

  
  const isIncoming = (tx) => {
   
    return tx.to_id === user.user_id && tx.to_role === user.role;
  };

  // 3. Filtering
  const filteredTransactions = transactions?.filter((tx) => {
    const incoming = isIncoming(tx);
    const matchesSearch =
      tx.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "credit") return matchesSearch && incoming;
    if (filterType === "debit") return matchesSearch && !incoming;
    return matchesSearch;
  });

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
        <Wallet className="h-12 w-12 text-zinc-300 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900">
          Failed to load history
        </h3>
        <p className="text-zinc-500 max-w-sm">
          We couldn't retrieve your transaction records. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Transaction History
          </h1>
          <p className="text-sm text-zinc-500">
            Track your payments, commissions, and refunds.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Reference ID or Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Incoming (Credit)</option>
            <option value="debit">Outgoing (Debit)</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {filteredTransactions?.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center bg-zinc-50/50">
            <CreditCard className="h-10 w-10 text-zinc-300 mb-2" />
            <p className="text-zinc-500 font-medium">No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <AnimatePresence>
                  {filteredTransactions.map((tx) => {
                    const incoming = isIncoming(tx);
                    return (
                      <motion.tr
                        key={tx.transaction_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                incoming
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-rose-100 text-rose-600"
                              }`}
                            >
                              {incoming ? (
                                <ArrowDownLeft size={20} />
                              ) : (
                                <ArrowUpRight size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900 capitalize">
                                {tx.transaction_type.replace("_", " ")}
                              </p>
                              <p className="text-xs text-zinc-500 capitalize">
                                Via {tx.payment_method}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded">
                            {tx.reference_id || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-zinc-400" />
                            {formatDate(tx.transaction_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-bold ${
                              incoming ? "text-emerald-600" : "text-zinc-900"
                            }`}
                          >
                            {incoming ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                            ${
                              tx.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : tx.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
