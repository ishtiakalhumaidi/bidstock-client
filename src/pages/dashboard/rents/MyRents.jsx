import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, ExternalLink, Calendar, Maximize, User, ArrowUpToLine } from "lucide-react";
import { getMyRents } from "../../../api/rents.api";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { CardSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

const STATUS_FILTERS = [
  { id: "all", label: "All Leases" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export default function MyRents() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["rents", "mine", page, statusFilter],
    queryFn: () => getMyRents({ 
      page, 
      limit: 12,
      status: statusFilter === "all" ? undefined : statusFilter 
    }),
  });

  const rents = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Control Node */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <ClipboardList size={14} /> 
            Storage Logistics
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">My Rented Spaces</h1>
        </div>

        {/* State Filter Tabs */}
        <div className="flex bg-paper-dim p-1 rounded-lg border border-line w-max shadow-sm">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                statusFilter === tab.id
                  ? "bg-white text-ink shadow-sm border border-line"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : rents.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No active leases"
          description={statusFilter === "all" ? "Browse available warehouses and secure floor space to begin operations." : `You have no ${statusFilter} lease agreements.`}
          actionLabel="Browse warehouses"
          onAction={() => (window.location.href = "/dashboard/all-warehouses")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rents.map((rent, i) => (
              <div 
                key={rent.rent_id} 
                data-aos="fade-up" 
                data-aos-delay={(i % 3) * 50}
                className="group flex flex-col bg-white/80 backdrop-blur-md border border-line rounded-2xl overflow-hidden hover:border-ink/20 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-line bg-gradient-to-b from-paper-dim/50 to-transparent">
                  <div className="flex justify-between items-start mb-3">
                    <StatusPill status={rent.status} />
                    <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest bg-white px-2 py-1 rounded border border-line">
                      ID: RENT-{rent.rent_id}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-ink line-clamp-1">
                    {rent.warehouse_location}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  
                  {/* Spatial Metrics & Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                        <Maximize size={12} /> Spatial Limits
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-ink leading-tight">
                          {Number(rent.floor_area_sqm || 0).toLocaleString()} sqm
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-ink-soft mt-0.5">
                          <ArrowUpToLine size={10} className="text-ink-muted" />
                          {Number(rent.ceiling_height_m || 3).toFixed(1)}m Ceiling
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-0.5">
                        Total Value
                      </span>
                      <span className="font-mono font-bold text-lg text-ink leading-none">
                        ${Number(rent.rental_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-line border-dashed" />

                  {/* Temporal Data */}
                  <div className="flex items-center gap-3 bg-paper-dim/40 p-3 rounded-lg border border-line-strong">
                    <Calendar size={16} className="text-ink-muted shrink-0" />
                    <div className="flex-1 flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono text-ink-muted tracking-wider">Commencement</span>
                        <span className="font-medium text-ink">{new Date(rent.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-ink-muted">→</div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase font-mono text-ink-muted tracking-wider">Expiration</span>
                        <span className="font-medium text-ink">{rent.end_date ? new Date(rent.end_date).toLocaleDateString() : "Open"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Counterparty Info */}
                <div className="p-4 border-t border-line bg-paper-dim/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
                      <User size={12} />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-semibold text-ink truncate">{rent.owner_name}</span>
                      <span className="text-[10px] font-mono text-ink-soft truncate">{rent.owner_phone}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={`mailto:${rent.owner_email}`} 
                    className="h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-line rounded-md text-ink hover:border-ink transition-colors shadow-sm shrink-0 press-scale"
                  >
                    Contact <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-line">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}