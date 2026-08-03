import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Boxes, MapPin, User, Mail, Phone } from "lucide-react";
import { getWarehouseOwnerInventory } from "../../../api/inventory.api";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

export default function WarehouseOwnerInventory() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", "warehouse-owner", page],
    queryFn: () => getWarehouseOwnerInventory({ page, limit: 10 }),
  });

  const inventories = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">

      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Boxes size={12} className="text-teal" />
            {pagination?.total ?? inventories.length} Stored Allocation{(pagination?.total ?? inventories.length) !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Facility Contents</h1>
        </div>
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
              title="Facilities are empty"
              description="No active tenants have deployed physical inventory into your warehouses."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-paper-dim border-b border-line text-[10px] uppercase font-mono tracking-widest text-ink-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Facility</th>
                  <th className="px-5 py-3.5 font-medium">Tenant</th>
                  <th className="px-5 py-3.5 font-medium text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {inventories.map((inv) => (
                  <tr key={inv.inventory_id} className="group hover:bg-paper-dim/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[11px] font-mono text-ink-soft flex items-center gap-1.5">
                        <MapPin size={10} className="text-ink-muted shrink-0" />
                        {inv.warehouse_location}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-paper border border-line overflow-hidden shrink-0 flex items-center justify-center">
                          {inv.seller_image ? (
                            <img src={inv.seller_image} alt={inv.seller_name} className="h-full w-full object-cover" />
                          ) : (
                            <User size={16} className="text-ink-muted/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate font-display mb-1">
                            {inv.seller_name}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {inv.seller_email ? (
                              <p className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
                                <Mail size={10} className="shrink-0" /> {inv.seller_email}
                              </p>
                            ) : null}
                            {inv.seller_phone ? (
                              <p className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
                                <Phone size={10} className="shrink-0" /> {inv.seller_phone}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono font-tabular font-semibold text-ink text-base">
                        {Number(inv.quantity).toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted ml-1">units</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-line">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}