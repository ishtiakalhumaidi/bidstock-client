import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Package, Plus, Pencil, Trash2, Gavel, Boxes, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { getSellerProducts, deleteProduct } from "../../../api/products.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { CardSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";
import { confirmAction } from "../../../lib/confirm";
import EditProductModal from "../../../pages/dashboard/seller/EditProductModal";
import OpenAuctionModal from "../../../pages/dashboard/seller/OpenAuctionModal";

export default function MyProducts() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [auctioning, setAuctioning] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "mine", page],
    queryFn: () => getSellerProducts({ page, limit: 12 }),
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Asset wiped from ledger.");
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Deletion sequence failed."),
  });

  const handleDelete = async (product) => {
    const ok = await confirmAction({
      title: "Purge asset record?",
      text: `Execution will permanently drop "${product.name}" from the database. Linked active logic may fail.`,
      confirmText: "Execute Purge",
      danger: true,
    });
    if (ok) remove.mutate(product.product_id);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">
            Active Dataset: {pagination?.total ?? products.length} Output{(pagination?.total ?? products.length) !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Supply Assets</h1>
        </div>
        <Link to="/dashboard/add-product">
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto shadow-sm">
            Inject Asset
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Empty Dataset"
          description="Initialize your supply pipeline by registering a product into the system architecture."
          actionLabel="Register Asset"
          onAction={() => (window.location.href = "/dashboard/add-product")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <Card 
                key={product.product_id} 
                aos="fade-up" 
                aosDelay={(i % 4) * 50} 
                className="overflow-hidden flex flex-col group hover:border-ink/20 transition-colors"
              >
                {/* Visual Block */}
                <div className="relative aspect-[4/3] bg-paper-dim flex items-center justify-center overflow-hidden border-b border-line">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={product.name} 
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#14181F 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  )}
                  {!product.image_url && <Package size={32} className="text-ink-muted/50 z-10" />}
                  
                  <div className="absolute top-3 right-3 z-20">
                    <StatusPill status={product.status} />
                  </div>
                </div>
                
                {/* Data Block */}
                <div className="p-4 flex flex-col flex-1 bg-white">
                  <h3 className="font-display font-medium text-ink line-clamp-2 min-w-0 leading-tight mb-3">
                    {product.name}
                  </h3>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Base Valuation</span>
                      <span className="font-mono font-tabular font-semibold text-ink text-lg tracking-tight">
                        ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Inventory</span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-ink-soft bg-paper-dim px-2 py-0.5 rounded border border-line">
                        <Boxes size={12} className="text-ink-muted" /> 
                        {product.available_quantity ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Execution Block */}
                <div className="p-3 border-t border-line bg-paper/50 flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="accent" 
                    icon={Gavel} 
                    className="flex-1 shadow-sm"
                    disabled={product.status !== "active" || !product.available_quantity}
                    onClick={() => setAuctioning(product)}
                  >
                    Deploy Auction
                  </Button>
                  <button
                    onClick={() => setEditing(product)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-line-strong text-ink-soft hover:border-ink hover:text-ink bg-white transition-colors shrink-0 tooltip-trigger"
                    title="Edit Asset"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-line-strong text-ink-soft hover:border-red hover:text-red hover:bg-red-soft bg-white transition-colors shrink-0 tooltip-trigger"
                    title="Purge Asset"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 border-t border-line pt-6">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Embedded Modals */}
      <EditProductModal product={editing} open={!!editing} onClose={() => setEditing(null)} />
      <OpenAuctionModal product={auctioning} open={!!auctioning} onClose={() => setAuctioning(null)} />
    </div>
  );
}