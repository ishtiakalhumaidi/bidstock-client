import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Warehouse, Plus, Pencil, Trash2, Users, Package, Ruler } from "lucide-react";
import toast from "react-hot-toast";
import { getMyWarehouses, deleteWarehouse } from "../../../api/warehouse.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { CardSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";
import { confirmAction } from "../../../lib/confirm";
import EditWarehouseModal from "../../../pages/dashboard/warehouse/EditWarehouseModal";

export default function MyWarehouses() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["warehouses", "mine", page],
    queryFn: () => getMyWarehouses({ page, limit: 12 }),
  });

  const warehouses = data?.data ?? [];
  const pagination = data?.pagination;

  const remove = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      toast.success("Facility deregistered");
      queryClient.invalidateQueries({ queryKey: ["warehouses", "mine"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Deregistration failed"),
  });

  const handleDelete = async (warehouse) => {
    const ok = await confirmAction({
      title: "Remove this warehouse?",
      text: "Warehouses with active tenants or stored inventory cannot be deleted.",
      confirmText: "Delete",
      danger: true,
    });
    if (ok) remove.mutate(warehouse.warehouse_id);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">

      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">
            Active Nodes: {pagination?.total ?? warehouses.length} Facilit{(pagination?.total ?? warehouses.length) !== 1 ? "ies" : "y"}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Facility Ledger</h1>
        </div>
        <Link to="/dashboard/add-warehouse">
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto shadow-sm">
            Register Facility
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : warehouses.length === 0 ? (
        <EmptyState
          icon={Warehouse}
          title="No capacity allocated"
          description="Register your first warehouse to begin leasing space to sellers."
          actionLabel="Register Facility"
          onAction={() => (window.location.href = "/dashboard/add-warehouse")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {warehouses.map((wh, i) => {
              const hasSpaceModel = wh.floor_area_sqm !== null && wh.floor_area_sqm !== undefined;
              const usedPct = wh.capacity ? Math.min(100, Math.round(((wh.used_quantity ?? 0) / wh.capacity) * 100)) : 0;

              return (
                <Card
                  key={wh.warehouse_id}
                  aos="fade-up"
                  aosDelay={(i % 4) * 50}
                  className="overflow-hidden flex flex-col group hover:border-ink/20 transition-colors"
                >
                  {/* Visual Block */}
                  <div className="relative h-24 bg-paper-dim flex items-center justify-center overflow-hidden border-b border-line">
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{ backgroundImage: 'radial-gradient(#14181F 1px, transparent 1px)', backgroundSize: '12px 12px' }}
                    />
                    <Warehouse size={28} className="text-ink-muted/50 z-10" />

                    <div className="absolute top-3 right-3 z-20">
                      <StatusPill status={wh.status} />
                    </div>
                  </div>

                  {/* Data Block */}
                  <div className="p-4 flex flex-col flex-1 bg-white">
                    <h3 className="font-display font-medium text-ink line-clamp-2 min-w-0 leading-tight mb-1">
                      {wh.location}
                    </h3>
                    <p className="font-mono font-tabular text-sm text-ink-soft mb-3">
                      ${Number(wh.price_per_day).toLocaleString()} / day
                    </p>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-line border-dashed">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Capacity</span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                          <Package size={12} className="text-teal" />
                          {wh.used_quantity ?? 0} / {wh.capacity}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Tenants</span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                          <Users size={12} className="text-amber-dark" />
                          {wh.tenant_count ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Utilization bar */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full bg-paper-dim rounded-full overflow-hidden border border-line">
                        <div
                          className="h-full bg-teal rounded-full transition-all"
                          style={{ width: `${usedPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      {hasSpaceModel ? (
                        <p className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
                          <Ruler size={12} />
                          {Number(wh.floor_area_sqm).toLocaleString()} sqm
                          {wh.ceiling_height_m ? ` · ${Number(wh.ceiling_height_m).toLocaleString()}m ceiling` : ""}
                        </p>
                      ) : (
                        <p className="text-[11px] font-mono text-ink-muted">
                          No floor area set — tracked by unit count only
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Execution Block */}
                  <div className="p-3 border-t border-line bg-paper/50 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Pencil}
                      className="flex-1"
                      onClick={() => setEditing(wh)}
                    >
                      Edit specs
                    </Button>
                    <button
                      onClick={() => handleDelete(wh)}
                      title="Remove Facility"
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-line-strong text-ink-soft hover:border-red hover:text-red hover:bg-red-soft bg-white transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 border-t border-line pt-6">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      <EditWarehouseModal warehouse={editing} open={!!editing} onClose={() => setEditing(null)} />
    </div>
  );
}