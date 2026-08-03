import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Package, Search, ShieldAlert, CheckCircle2, 
  XCircle, AlertOctagon, Tag 
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Pagination from "../../../components/ui/Pagination";
import { Skeleton } from "../../../components/ui/Skeleton";

// Utilizing your actual products API for the global administrative view
import { getProducts, updateProduct } from "../../../api/products.api"; 

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch all products across the platform
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "all-products", page, search],
    queryFn: () => getProducts({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  // Admin Override Mutation
  const overrideMutation = useMutation({
    mutationFn: ({ productId, payload }) => updateProduct(productId, payload),
    onSuccess: () => {
      toast.success("Asset state overridden successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "all-products"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to override asset status.");
    }
  });

  const handleOverride = (productId, currentStatus) => {
    // If it's active or inactive, the admin can force it into 'discontinued'. Otherwise, restore it to 'active'.
    const newStatus = currentStatus === 'discontinued' ? 'active' : 'discontinued';
    const actionWord = newStatus === 'discontinued' ? 'DISCONTINUE' : 'REACTIVATE';
    
    if (window.confirm(`WARNING: You are about to forcefully ${actionWord} this supply asset. Proceed?`)) {
      overrideMutation.mutate({ productId, payload: { status: newStatus } });
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
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Global Product State</h1>
        </div>
        
        <div className="w-full sm:w-72">
          <Input 
            placeholder="Search asset ID or name..." 
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
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Asset Details</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Supplier Node</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted font-medium">Market Specs</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState 
                      icon={Package} 
                      title="No Assets Detected" 
                      description="There are currently no products registered on the platform." 
                    />
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-paper-dim/30 transition-colors group">
                    
                    {/* Asset Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt="asset" className="h-full w-full object-cover" />
                          ) : (
                            <Package size={16} className="text-ink-muted" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-medium text-sm text-ink truncate">{product.name}</p>
                          <p className="text-[10px] font-mono text-ink-muted mt-0.5">PRD_REF: {String(product.product_id).padStart(6, '0')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-ink">{product.seller_name || `User ID: ${product.seller_id}`}</span>
                        <span className="text-[11px] text-ink-muted font-mono truncate">NODE: {product.seller_id}</span>
                      </div>
                    </td>

                    {/* Market Specs */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-ink">
                          ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[11px] text-ink-muted font-mono mt-0.5 flex items-center gap-1">
                          <Tag size={10} className="text-ink-muted" />
                          {product.category || 'Uncategorized'}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest font-medium border ${
                        product.status === 'active' 
                          ? 'bg-teal-soft/30 text-teal border-teal/20' 
                          : product.status === 'inactive'
                          ? 'bg-amber-soft/30 text-amber-dark border-amber/20'
                          : 'bg-red-soft/30 text-red border-red/20'
                      }`}>
                        {product.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {product.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={AlertOctagon}
                        loading={overrideMutation.isPending && overrideMutation.variables?.productId === product.product_id}
                        onClick={() => handleOverride(product.product_id, product.status)}
                        className={`shadow-sm text-[10px] font-mono uppercase tracking-wider ${
                          product.status !== 'discontinued' 
                            ? 'hover:border-red hover:text-red hover:bg-red-soft/20' 
                            : 'hover:border-teal hover:text-teal hover:bg-teal-soft/20'
                        }`}
                      >
                        {product.status !== 'discontinued' ? 'Force Discontinue' : 'Reactivate'}
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