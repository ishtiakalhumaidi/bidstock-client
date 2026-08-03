import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { MapPin, Warehouse, CalendarCheck, Maximize, Clock } from "lucide-react";
import { getWarehouses } from "../../../api/warehouse.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { CardSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";
import { useAuth } from "../../../hooks/useAuth";

const TABS = [
  { id: "all", label: "All Facilities" },
  { id: "available", label: "Available Now" },
  { id: "booked", label: "Pre-Book (Occupied)" },
];

export default function AllWarehouses() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["warehouses", "all", page],
    queryFn: () => getWarehouses({ page, limit: 12 }),
  });

  const rawWarehouses = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side intersection for availability tabs
  const warehouses = rawWarehouses.filter((wh) => {
    if (activeTab === "all") return wh.status !== "maintenance";
    return wh.status === activeTab;
  });

  const handleLeaseAction = (warehouseId) => {
    if (!user) {
      navigate("/auth/signin", { state: { from: `/dashboard/warehouse/rent/${warehouseId}` } });
      return;
    }
    navigate(`/dashboard/warehouse/rent/${warehouseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
            Logistics Network
          </p>
          <h1 className="font-display font-semibold text-2xl text-ink">Global Facilities</h1>
        </div>

        {/* State Filter Tabs */}
        <div className="flex bg-paper-dim p-1 rounded-lg border border-line w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : warehouses.length === 0 ? (
        <EmptyState
          icon={Warehouse}
          title="No facilities found"
          description="There are currently no warehouses matching this status constraint."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {warehouses.map((wh, i) => (
              <Card key={wh.warehouse_id} className="hover-lift" aos="fade-up" aosDelay={(i % 3) * 50}>
                <div className="p-5 flex flex-col h-full gap-5">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-semibold text-base text-ink mb-1 truncate">
                        {wh.location}
                      </h3>
                      <p className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
                        <MapPin size={13} /> {wh.owner_name}
                      </p>
                    </div>
                    <StatusPill status={wh.status} />
                  </div>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-line">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1 flex items-center gap-1">
                        <Maximize size={12} /> Capacity
                      </p>
                      <p className="font-mono text-sm text-ink">{wh.capacity} Units</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1 flex items-center gap-1">
                        <Clock size={12} /> Rate
                      </p>
                      <p className="font-mono text-sm text-ink">${Number(wh.price_per_day).toLocaleString()}/day</p>
                    </div>
                  </div>

                  {/* Execution Node */}
                  <div className="mt-auto">
                    <Button
                      variant={wh.status === "booked" ? "outline" : "accent"}
                      className="w-full"
                      icon={CalendarCheck}
                      disabled={user?.role === 'buyer' || user?.role === 'admin'}
                      onClick={() => handleLeaseAction(wh.warehouse_id)}
                    >
                      {wh.status === "booked" ? "Pre-Book Facility" : "Secure Lease"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {pagination && (
            <div className="mt-8 border-t border-line pt-6">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}