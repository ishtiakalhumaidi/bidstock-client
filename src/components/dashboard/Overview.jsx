import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  DollarSign, Gavel, Boxes, ClipboardList, Wallet, Inbox,
  Trophy, Warehouse, Users, Store, ArrowRight, Activity, 
  Search, AlertTriangle, TrendingDown, Maximize, PackageCheck, BadgeMinus
} from "lucide-react";
import { getDashboardStats, getUsers } from "../../api/users.api";
import { getTransactions } from "../../api/transactions.api";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../../components/dashboard/StatCard";
import { Skeleton } from "../../components/ui/Skeleton";

export default function Overview() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    enabled: user?.role !== "admin",
  });

  const stats = data?.data ?? {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" data-aos="fade-up">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Activity size={12} className="text-teal" /> 
            Welcome back • System Status: Online
          </p>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink tracking-tight">
            {user?.name?.split(" ")[0]}'s Command Center
          </h1>
        </div>
        {stats.unread_notifications > 0 && (
          <div className="flex items-center gap-2 bg-amber-soft border border-amber/20 text-amber-dark px-3 py-1.5 rounded-full text-xs font-medium animate-pulse">
            <AlertTriangle size={14} />
            {stats.unread_notifications} Unread Alerts
          </div>
        )}
      </div>

      {user?.role === "admin" ? (
        <AdminStats />
      ) : isLoading ? (
        <StatsSkeleton count={8} />
      ) : user?.role === "seller" ? (
        <SellerStats stats={stats} />
      ) : user?.role === "buyer" ? (
        <BuyerStats stats={stats} />
      ) : user?.role === "warehouse_owner" ? (
        <WarehouseOwnerStats stats={stats} />
      ) : null}
    </div>
  );
}

function StatsSkeleton({ count }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

function SellerStats({ stats }) {
  return (
    <div className="space-y-6">
      {/* Primary Financial & Logistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total revenue" value={`$${Number(stats.total_revenue ?? 0).toLocaleString()}`} tone="teal" />
        <StatCard icon={PackageCheck} label="Completed Sales" value={stats.total_sales ?? 0} tone="teal" aosDelay={60} />
        <StatCard icon={Gavel} label="Active auctions" value={stats.active_auctions ?? 0} tone="amber" aosDelay={120} />
        <StatCard icon={Boxes} label="Total inventory units" value={stats.total_inventory ?? 0} tone="ink" aosDelay={180} />
      </div>

      {/* Secondary Operational Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={AlertTriangle} 
          label="Low Stock Alerts" 
          value={stats.low_stock_alerts ?? 0} 
          tone={stats.low_stock_alerts > 0 ? "amber" : "ink"} 
          hint="Items below minimum threshold"
        />
        <StatCard icon={Store} label="Active Products" value={stats.active_products ?? 0} tone="ink" aosDelay={60} />
        <StatCard icon={BadgeMinus} label="Closed Auctions" value={stats.closed_auctions ?? 0} tone="ink" aosDelay={120} />
        <StatCard icon={Warehouse} label="Active Leases" value={stats.active_rents ?? 0} tone="ink" aosDelay={180} />
      </div>

      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink">Market Activity Timeline</h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted bg-paper-dim px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <p className="text-sm text-ink-muted max-w-md">
            Sufficient concurrent transaction volume is required to render your logistical heatmaps and predictive analytics. Continue scaling operations.
          </p>
        </div>

        <div className="bg-ink rounded-2xl p-6 shadow-md flex flex-col relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-white/5">
            <Warehouse size={140} />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="font-display font-semibold text-white mb-2 text-xl">Space Allocation</h3>
            <p className="text-sm text-ink-muted mb-8 leading-relaxed">
              Require additional square footage to resolve low stock alerts? Procure new warehouse space directly from verified owners.
            </p>
            <Link 
              to="/warehouses" 
              className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-amber text-ink rounded-xl font-medium hover:bg-amber-dark hover:shadow-lg transition-all press-scale"
            >
              <Search size={18} /> Browse Facilities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyerStats({ stats }) {
  return (
    <div className="space-y-6">
      {/* Primary Financial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Capital Deployed" value={`$${Number(stats.total_spent ?? 0).toLocaleString()}`} tone="teal" />
        <StatCard 
          icon={TrendingDown} 
          label="Pending Liability" 
          value={`$${Number(stats.pending_liability ?? 0).toLocaleString()}`} 
          tone="amber" 
          hint="Capital locked in open bids"
          aosDelay={60} 
        />
        <StatCard icon={Inbox} label="Pending Offers" value={stats.pending_offers ?? 0} tone="ink" aosDelay={120} />
        <StatCard icon={Trophy} label="Won Auctions" value={stats.won_auctions ?? 0} tone="teal" aosDelay={180} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink">Acquisition Trajectory</h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted bg-paper-dim px-2 py-1 rounded">Real-time</span>
          </div>
           <p className="text-sm text-ink-muted max-w-md">
            Your asset acquisition charts will dynamically render upon the successful resolution of your pending liabilities and active offers.
          </p>
        </div>

        <div className="bg-amber-soft border border-amber/20 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -bottom-10 -right-5 text-amber/20">
            <Gavel size={120} />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="font-display font-semibold text-ink mb-2 text-xl">Market Operations</h3>
            <p className="text-sm text-ink-soft mb-8 leading-relaxed">
              Explore the latest industrial assets and place strategic bids to aggressively expand your supply chain.
            </p>
            <Link 
              to="/auctions" 
              className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-ink text-white rounded-xl font-medium hover:bg-ink/90 hover:shadow-lg transition-all press-scale"
            >
              <Gavel size={18} /> Enter Auction House
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function WarehouseOwnerStats({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Gross Yield" value={`$${Number(stats.total_earnings ?? 0).toLocaleString()}`} tone="teal" />
        <StatCard icon={Warehouse} label="Facilities Listed" value={stats.total_warehouses ?? 0} tone="amber" aosDelay={60} />
        <StatCard icon={Users} label="Unique Tenants" value={stats.unique_tenants ?? 0} tone="ink" aosDelay={120} />
        <StatCard icon={ClipboardList} label="Active Leases" value={stats.active_leases ?? 0} tone="ink" aosDelay={180} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard 
          icon={Maximize} 
          label="Total Floor Space (sqm)" 
          value={Number(stats.total_floor_space ?? 0).toLocaleString()} 
          tone="ink" 
          hint="Total physical footprint managed"
        />
        <StatCard 
          icon={Boxes} 
          label="Total Volumetric Capacity" 
          value={Number(stats.total_capacity ?? 0).toLocaleString()} 
          tone="ink" 
          hint="Maximum unit/pallet load"
          aosDelay={60}
        />
      </div>
    </div>
  );
}
function AdminStats() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users-count"],
    queryFn: () => getUsers(),
  });
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["admin", "transactions-count"],
    queryFn: getTransactions,
  });

  const users = usersData?.data ?? [];
  const transactions = txData?.data ?? [];

  // Deep Data Computations for Admin
  const sellers = users.filter((u) => u.role === "seller").length;
  const buyers = users.filter((u) => u.role === "buyer").length;
  const owners = users.filter((u) => u.role === "warehouse_owner").length;

  const completedTx = transactions.filter((t) => t.status === "completed");
  const totalVolume = completedTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  if (usersLoading || txLoading) {
    return <StatsSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Level Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Network Users" value={users.length} tone="ink" />
        <StatCard 
          icon={DollarSign} 
          label="Platform Volume" 
          value={`$${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          tone="teal" 
          aosDelay={60} 
        />
        <StatCard icon={ClipboardList} label="Total Transactions" value={transactions.length} tone="amber" aosDelay={120} />
        <StatCard icon={Store} label="Active Sellers" value={sellers} tone="ink" aosDelay={180} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Global Transaction Ledger */}
        <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6 shadow-sm flex flex-col" data-aos="fade-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-ink">Global Transaction Ledger</h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal bg-teal-soft/30 border border-teal/20 px-2 py-1 rounded">Live Feed</span>
          </div>
          
          {transactions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-line rounded-xl bg-paper-dim/50 min-h-[200px]">
              <Activity size={32} className="text-ink-muted mb-3 opacity-50" />
              <p className="text-sm font-mono text-ink-muted text-center max-w-xs">
                No financial transactions have been recorded on the network yet.
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <ul className="divide-y divide-line">
                {transactions.slice(0, 5).map((t) => (
                  <li key={t.transaction_id} className="flex items-center justify-between gap-3 py-3.5 hover:bg-paper-dim/50 px-3 -mx-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        t.status === 'completed' ? 'bg-teal-soft/30 text-teal border-teal/20' : 
                        t.status === 'failed' ? 'bg-red-soft/30 text-red border-red/20' : 
                        'bg-amber-soft/30 text-amber-dark border-amber/20'
                      }`}>
                        <DollarSign size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-ink truncate">{t.product_name || "System Transfer"}</p>
                        <p className="text-[11px] text-ink-muted truncate mt-0.5 flex items-center gap-1 font-mono uppercase tracking-wider">
                          {t.from_name} <ArrowRight size={10} className="text-line" /> {t.to_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-tabular font-semibold text-ink text-sm">
                        ${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-[10px] font-mono uppercase tracking-widest mt-1 ${
                        t.status === 'completed' ? 'text-teal' : 
                        t.status === 'failed' ? 'text-red' : 'text-amber-dark'
                      }`}>
                        {t.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-line text-right">
            <Link to="/dashboard/all-transactions" className="text-xs font-mono uppercase tracking-widest font-medium text-amber-dark hover:text-ink transition-colors flex items-center justify-end gap-1">
              View full ledger <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Network Demographics Sidebar */}
        <div className="bg-ink rounded-2xl p-6 shadow-md flex flex-col relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div className="absolute -top-10 -right-10 text-white/5">
            <Users size={140} />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="font-display font-semibold text-white mb-8 text-xl">Network Demographics</h3>
            
            <div className="space-y-6 mb-8 flex-1">
              {/* Buyer Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-2">
                  <span>Procurement (Buyers)</span>
                  <span className="text-white font-semibold">{buyers}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal transition-all duration-1000" style={{ width: `${users.length ? (buyers / users.length) * 100 : 0}%` }} />
                </div>
              </div>
              
              {/* Seller Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-2">
                  <span>Suppliers (Sellers)</span>
                  <span className="text-white font-semibold">{sellers}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber transition-all duration-1000 delay-150" style={{ width: `${users.length ? (sellers / users.length) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Owner Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-2">
                  <span>Facility Owners</span>
                  <span className="text-white font-semibold">{owners}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 transition-all duration-1000 delay-300" style={{ width: `${users.length ? (owners / users.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            <Link 
              to="/dashboard/users" 
              className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all press-scale border border-white/10"
            >
              <Users size={18} /> Manage User Roles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}