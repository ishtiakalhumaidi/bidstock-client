import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Boxes, Plus, Pencil, Trash2, AlertTriangle, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { getMyInventory, deleteInventory } from "../../../api/inventory.api";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";
import { confirmAction } from "../../../lib/confirm";
import EditInventoryModal from "../../../components/dashboard/inventory/EditInventoryModal";
import WarehouseOwnerInventory from "./WarehouseOwnerInventory";

export default function MyInventory() {
  const { user } = useAuth();

  if (user?.role === "warehouse_owner") {
    return <WarehouseOwnerInventory />;
  }

  return <SellerInventory />;
}

function SellerInventory() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", "mine", page],
    queryFn: () => getMyInventory({ page, limit: 12 }),
  });

  const inventories = data?.data ?? [];
  const pagination = data?.pagination;

  const remove = useMutation({
    mutationFn: ({ productId, warehouseId }) => deleteInventory(productId, warehouseId),
    onSuccess: () => {
      toast.success("Inventory allocation cleared from the ledger.");
      queryClient.invalidateQueries({ queryKey: ["inventory", "mine"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Purge sequence failed."),
  });

  const handleDelete = async (inv) => {
    const ok = await confirmAction({
      title: "Remove Inventory Allocation?",
      text: "This removes the physical stock tracking from this facility. Assets locked in pending transactions cannot be purged.",
      confirmText: "Execute Purge",
      danger: true,
    });
    if (ok) remove.mutate({ productId: inv.product_id, warehouseId: inv.warehouse_id });
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Boxes size={12} className="text-teal" />
            {pagination?.total ?? inventories.length} Active Allocation{(pagination?.total ?? inventories.length) !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Stock Map</h1>
        </div>
        <Link to="/dashboard/add-inventory">
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto shadow-sm">
            Deploy Inventory
          </Button>
        </Link>
      </div>

      {/* Operational List Matrix */}
      <div className="bg-white/80 backdrop-blur-md border border-line rounded-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : inventories.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Boxes}
              title="No physical stock located"
              description="Deploy inventory into your active leased warehouses to begin tracking physical assets."
              actionLabel="Deploy Inventory"
              onAction={() => (window.location.href = "/dashboard/add-inventory")}
            />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {inventories.map((inv) => (
              <li
                key={inv.inventory_id}
                className="group flex flex-col md:flex-row md:items-center gap-4 px-5 py-5 hover:bg-paper-dim/50 transition-colors"
              >
                {/* Asset Identity */}
                <div className="flex items-center gap-4 md:w-2/5 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-paper border border-line overflow-hidden shrink-0 flex items-center justify-center">
                    {inv.image_url ? (
                      <img src={inv.image_url} alt={inv.product_name} className="h-full w-full object-cover" />
                    ) : (
                      <Boxes size={18} className="text-ink-muted/50" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate font-display mb-1">
                      {inv.product_name}
                    </p>
                    <p className="text-[11px] font-mono text-ink-soft flex items-center gap-1.5">
                      <MapPin size={10} /> {inv.warehouse_location}
                    </p>
                  </div>
                </div>

                {/* Volume & Status */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center md:w-1/4 py-3 md:py-0 border-y border-line md:border-none border-dashed">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Physical Volume</span>
                    <span className="font-mono font-tabular font-semibold text-ink text-base">
                      {Number(inv.quantity).toLocaleString()} Units
                    </span>
                  </div>
                  <div className="flex flex-col items-end md:items-start md:mt-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">System Status</span>
                    {inv.quantity <= inv.min_stock_level ? (
                      <span className="inline-flex items-center gap-1 text-red font-medium text-[10px] uppercase tracking-wider bg-red-soft px-2 py-0.5 rounded border border-red/20">
                        <AlertTriangle size={10} /> Low Stock
                      </span>
                    ) : (
                      <span className="text-teal font-medium text-[10px] uppercase tracking-wider bg-teal-soft px-2 py-0.5 rounded border border-teal/20">
                        Optimal
                      </span>
                    )}
                  </div>
                </div>

                {/* Execution Nodes */}
                <div className="flex items-center justify-end gap-2 mt-2 md:mt-0 md:w-auto md:ml-auto shrink-0">
                  <div className="flex items-center gap-1 bg-paper border border-line rounded-lg p-1">
                    <button
                      onClick={() => setEditing(inv)}
                      title="Adjust Allocation"
                      className="h-8 w-8 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-paper-dim transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv)}
                      title="Purge Allocation"
                      className="h-8 w-8 flex items-center justify-center rounded-md text-ink-soft hover:text-red hover:bg-red-soft transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-line">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}

      <EditInventoryModal
        inventory={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        queryKey={["inventory", "mine"]}
      />
    </div>
  );
}