import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MapPin,
  Maximize,
  Building2,
  Trash2,
  Edit2,
  Users,
  X,
  Calendar,
  Phone,
  Mail,
  Loader2,
  Warehouse,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/auth.api";

// --- BOOKINGS MODAL ---
const BookingsModal = ({ warehouseId, onClose }) => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["warehouse-bookings", warehouseId],
    queryFn: async () => {
      const res = await api.get(`/rents/warehouse/${warehouseId}`);
      return res.data.data;
    },
    enabled: !!warehouseId,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <h3 className="font-bold text-zinc-900 text-lg">
            Warehouse Bookings
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-rose-500 h-8 w-8" />
            </div>
          ) : bookings?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                <Users size={32} />
              </div>
              <p className="text-zinc-500 font-medium">
                No bookings found for this warehouse.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.rent_id}
                  className="p-4 border border-zinc-200 rounded-xl hover:border-rose-200 transition-colors bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-zinc-900">
                        {booking.seller_name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <Mail size={12} /> {booking.seller_email}
                      </div>
                      {booking.seller_phone && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <Phone size={12} /> {booking.seller_phone}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        booking.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Calendar size={14} className="text-rose-500" />
                      <span className="font-medium">Start:</span>{" "}
                      {new Date(booking.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Calendar size={14} className="text-rose-500" />
                      <span className="font-medium">End:</span>{" "}
                      {booking.end_date
                        ? new Date(booking.end_date).toLocaleDateString()
                        : "Ongoing"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- WAREHOUSE CARD ---
const WarehouseCard = ({ warehouse, onDelete, onEdit, onViewBookings }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Capacity Logic
  const used = parseFloat(warehouse.used_capacity || 0);
  const total = parseFloat(warehouse.capacity);
  const percentage = Math.min(100, Math.round((used / total) * 100));

  // Progress Bar Color Logic
  const getProgressColor = (p) => {
    if (p >= 100) return "bg-red-500";
    if (p > 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const statusConfig = {
    available: {
      color: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
      label: "Available",
    },
    booked: {
      color: "bg-blue-100 text-blue-700",
      dot: "bg-blue-500",
      label: "Active Rents",
    },
    maintenance: {
      color: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
      label: "Maintenance",
    },
  };

  const status = statusConfig[warehouse.status] || statusConfig.available;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-100 transition-all duration-300"
    >
      <div className="relative h-28 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 p-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-100 text-rose-600">
          <Building2 size={24} />
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="bg-white/90 backdrop-blur text-rose-600 text-sm font-bold px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
            {formatPrice(warehouse.price)}{" "}
            <span className="text-xs font-normal text-zinc-500">/mo</span>
          </span>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
            <button
              onClick={() => onViewBookings(warehouse.warehouse_id)}
              className="p-1.5 bg-white rounded-lg hover:bg-blue-50 text-zinc-500 hover:text-blue-600 border border-zinc-200 shadow-sm transition-colors"
              title="View Bookings"
            >
              <Users size={16} />
            </button>
            <button
              onClick={() => onEdit(warehouse.warehouse_id)}
              className="p-1.5 bg-white rounded-lg hover:bg-rose-50 text-zinc-500 hover:text-rose-600 border border-zinc-200 shadow-sm transition-colors"
              title="Edit Warehouse"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(warehouse.warehouse_id)}
              className="p-1.5 bg-white rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600 border border-zinc-200 shadow-sm transition-colors"
              title="Delete Warehouse"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg mb-1 flex items-center gap-2">
            Warehouse #{warehouse.warehouse_id}
          </h3>
          <div className="flex items-start gap-2 text-zinc-500 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2" title={warehouse.location}>
              {warehouse.location}
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-100" />

        {/* Capacity Visualizer */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="text-zinc-400">Capacity Usage</span>
            <span
              className={percentage >= 100 ? "text-red-500" : "text-zinc-600"}
            >
              {used.toLocaleString()} / {total.toLocaleString()} sq ft
            </span>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-100">
            <div
              className={`h-full ${getProgressColor(
                percentage
              )} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function MyWarehouses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: warehouses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-warehouses"],
    queryFn: async () => {
      const res = await api.get("/warehouses/my-warehouse");
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/warehouses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-warehouses"]);
    },
  });

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to remove this warehouse listing?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    // Navigate or open edit modal
    console.log("Edit warehouse:", id);
  };
  const warehouseList = Array.isArray(warehouses)
    ? warehouses
    : warehouses
    ? [warehouses]
    : [];
  const filteredWarehouses = warehouseList.filter((item) =>
    item?.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Warehouse className="h-12 w-12 text-zinc-300 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900">
          Failed to load warehouses
        </h3>
        <p className="text-zinc-500 max-w-sm">
          Something went wrong fetching your facilities. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            My Warehouses
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your storage facilities and capacity (
            {warehouses?.length || 0} locations)
          </p>
        </div>
        <Link
          to="/dashboard/warehouses/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform hover:scale-105 hover:bg-rose-700 active:scale-95"
        >
          <Plus size={18} />
          Add Warehouse
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by location or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {filteredWarehouses?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
          <Warehouse className="h-10 w-10 text-zinc-300 mb-2" />
          <p className="text-zinc-500 font-medium">No warehouses found.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-rose-600 text-sm mt-2 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredWarehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.warehouse_id}
                warehouse={warehouse}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewBookings={() =>
                  setSelectedWarehouse(warehouse.warehouse_id)
                }
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedWarehouse && (
          <BookingsModal
            warehouseId={selectedWarehouse}
            onClose={() => setSelectedWarehouse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
