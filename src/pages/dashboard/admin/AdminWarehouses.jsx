import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Warehouse, Search, ShieldAlert, CheckCircle2, 
  Wrench, AlertOctagon, MapPin, Lock
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Pagination from "../../../components/ui/Pagination";
import { Skeleton } from "../../../components/ui/Skeleton";

// Utilizing your actual warehouse API for the global administrative view
import { getWarehouses, updateWarehouse } from "../../../api/warehouse.api"; 

export default function AdminWarehouses() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch all warehouses across the platform
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "all-warehouses", page, search],
    queryFn: () => getWarehouses({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const warehouses = data?.data ?? [];
  const pagination = data?.pagination;

  // Admin Override Mutation using your updateWarehouse endpoint
  const overrideMutation = useMutation({
    mutationFn: ({ warehouseId, payload }) => updateWarehouse(warehouseId, payload),
    onSuccess: () => {
      toast.success("Facility network state overridden successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "all-warehouses"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to override facility status.");
    }
  });

  const handleOverride = (warehouseId, currentStatus) => {
    // If it's available or booked, force it into maintenance to suspend it. Otherwise, restore it.
    const newStatus = currentStatus === 'maintenance' ? 'available' : 'maintenance';
    const actionWord = newStatus === 'maintenance' ? 'SUSPEND' : 'REACTIVATE';
    
    if (window.confirm(`WARNING: You are about to forcefully ${actionWord} this facility. Proceed?`)) {
      overrideMutation.mutate({ warehouseId, payload: { status: newStatus } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-8 p-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" data-aos="fade-up">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-red" /> 
            Administrative Override Authority
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Global Warehouse State</h1>
        </div>
        
        <div className="w-full sm:w-72">
          <Input 
            placeholder="Search location or owner..." 
            icon={Search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
          />
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper-dim/50 border-b border-line">
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Facility Details</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Owner Node</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Spatial Specs</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Network Status</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState 
                      icon={Warehouse} 
                      title="No Facilities Active" 
                      description="There are currently no warehouse spaces listed on the network." 
                    />
                  </td>
                </tr>
              ) : (
                warehouses.map((warehouse) => (
                  <tr key={warehouse.warehouse_id} className="hover:bg-paper-dim/30 transition-colors group">
                    
                    {/* Facility Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0">
                          <Warehouse size={16} className="text-ink-muted" />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-medium text-sm text-ink truncate flex items-center gap-1">
                            <MapPin size={12} className="text-ink-muted shrink-0" />
                            {warehouse.location}
                          </p>
                          <p className="text-[10px] font-mono text-ink-muted mt-0.5">WHS_REF: {String(warehouse.warehouse_id).padStart(6, '0')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-ink">{warehouse.owner_name || `User ID: ${warehouse.owner_id}`}</span>
                        <span className="text-[11px] text-ink-muted font-mono truncate">NODE: {warehouse.owner_id}</span>
                      </div>
                    </td>

                    {/* Valuation & Specs */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-ink">
                          ${Number(warehouse.price_per_day).toLocaleString(undefined, { minimumFractionDigits: 2 })}/day
                        </span>
                        <span className="text-[11px] text-ink-muted font-mono mt-0.5">
                          CAPACITY: {warehouse.capacity.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest font-medium border ${
                        warehouse.status === 'available' 
                          ? 'bg-teal-soft/30 text-teal border-teal/20' 
                          : warehouse.status === 'booked'
                          ? 'bg-amber-soft/30 text-amber-dark border-amber/20'
                          : 'bg-red-soft/30 text-red border-red/20'
                      }`}>
                        {warehouse.status === 'available' ? <CheckCircle2 size={10} /> : warehouse.status === 'booked' ? <Lock size={10} /> : <Wrench size={10} />}
                        {warehouse.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={AlertOctagon}
                        loading={overrideMutation.isPending && overrideMutation.variables?.warehouseId === warehouse.warehouse_id}
                        onClick={() => handleOverride(warehouse.warehouse_id, warehouse.status)}
                        className={`shadow-sm text-[10px] font-mono uppercase tracking-wider ${
                          warehouse.status !== 'maintenance' 
                            ? 'hover:border-red hover:text-red hover:bg-red-soft/20' 
                            : 'hover:border-teal hover:text-teal hover:bg-teal-soft/20'
                        }`}
                      >
                        {warehouse.status !== 'maintenance' ? 'Force Suspend' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-line bg-paper-dim/30">
            <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}