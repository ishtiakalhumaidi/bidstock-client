import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, Users, Package, ShoppingCart, Gavel, 
  Wallet, DollarSign, Warehouse, Loader2 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/auth.api';


// --- Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between hover:shadow-md transition-all">
    <div>
      <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
      {subtext && <p className="text-xs text-zinc-400 mt-1">{subtext}</p>}
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export default function Overview() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/users/dashboard-stats');
      return res.data.data;
    }
  });

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard Overview</h1>
        <p className="text-zinc-500">Welcome back, {user?.name}. Here's what's happening with your account.</p>
      </div>

      {/* --- SELLER DASHBOARD --- */}
      {user?.role === 'seller' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(stats.total_revenue)} 
            icon={DollarSign} 
            color="bg-emerald-500"
            subtext="From completed transactions"
          />
          <StatCard 
            title="Active Auctions" 
            value={stats.active_auctions} 
            icon={Gavel} 
            color="bg-rose-500"
            subtext="Live bidding now"
          />
          <StatCard 
            title="Inventory Units" 
            value={stats.total_inventory} 
            icon={Package} 
            color="bg-blue-500"
            subtext="Across all warehouses"
          />
          <StatCard 
            title="Active Rents" 
            value={stats.active_rents} 
            icon={Warehouse} 
            color="bg-orange-500"
            subtext="Storage facilities rented"
          />
        </div>
      )}

      {/* --- BUYER DASHBOARD --- */}
      {user?.role === 'buyer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Spent" 
            value={formatCurrency(stats.total_spent)} 
            icon={Wallet} 
            color="bg-violet-500"
            subtext="Lifetime purchases"
          />
          <StatCard 
            title="Pending Offers" 
            value={stats.pending_offers} 
            icon={ShoppingCart} 
            color="bg-amber-500"
            subtext="Awaiting seller acceptance"
          />
          <StatCard 
            title="Auctions Won" 
            value={stats.won_auctions} 
            icon={TrendingUp} 
            color="bg-emerald-500"
            subtext="Successfully closed deals"
          />
        </div>
      )}

      {/* --- WAREHOUSE OWNER DASHBOARD --- */}
      {user?.role === 'warehouse_owner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Earnings" 
            value={formatCurrency(stats.total_earnings)} 
            icon={DollarSign} 
            color="bg-emerald-600"
            subtext="Revenue from rents"
          />
          <StatCard 
            title="My Warehouses" 
            value={stats.total_warehouses} 
            icon={Warehouse} 
            color="bg-zinc-700"
            subtext="Listed facilities"
          />
          <StatCard 
            title="Active Tenants" 
            value={stats.active_tenants} 
            icon={Users} 
            color="bg-indigo-500"
            subtext="Current renters"
          />
        </div>
      )}

     
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm h-64 flex flex-col justify-center items-center text-center">
         <div className="h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="text-zinc-300" />
         </div>
         <h3 className="font-semibold text-zinc-900">Activity Feed</h3>
         <p className="text-sm text-zinc-500 mt-1">Detailed transaction logs and notifications will appear here.</p>
      </div>
    </div>
  );
}