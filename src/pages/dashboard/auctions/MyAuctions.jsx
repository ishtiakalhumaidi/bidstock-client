import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Gavel, Trash2, XCircle, ExternalLink, Inbox, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { getMyBids, updateBid, deleteBid } from "../../../api/bids.api";
import StatusPill from "../../../components/ui/StatusPill";
import CountdownChip from "../../../components/ui/CountdownChip";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import { confirmAction } from "../../../lib/confirm";

export default function MyAuctions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["bids", "my-bids"],
    queryFn: getMyBids,
  });

  const bids = data?.data ?? [];

  const close = useMutation({
    mutationFn: (bidId) => updateBid(bidId, { status: "closed" }),
    onSuccess: () => {
      toast.success("Auction protocol terminated.");
      queryClient.invalidateQueries({ queryKey: ["bids", "my-bids"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Termination failed."),
  });

  const remove = useMutation({
    mutationFn: deleteBid,
    onSuccess: () => {
      toast.success("Auction record purged.");
      queryClient.invalidateQueries({ queryKey: ["bids", "my-bids"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Purge sequence failed."),
  });

  const handleClose = async (bid) => {
    const ok = await confirmAction({
      title: "Terminate active auction?",
      text: `"${bid.product_name}" will immediately stop accepting new offers. Existing offers will remain valid for review.`,
      confirmText: "Terminate Protocol",
      danger: true,
    });
    if (ok) close.mutate(bid.bid_id);
  };

  const handleDelete = async (bid) => {
    const ok = await confirmAction({
      title: "Purge auction record?",
      text: "System constraint: Auctions with pending offers cannot be purged. You must resolve or close them first.",
      confirmText: "Execute Purge",
      danger: true,
    });
    if (ok) remove.mutate(bid.bid_id);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Activity size={12} className="text-amber-dark" />
            Active Operations: {bids.length} Node{bids.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Deployed Auctions</h1>
        </div>
      </div>

      {/* Operational Matrix */}
      <div className="bg-white border border-line rounded-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : bids.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Gavel}
              title="No active deployments"
              description="Select an asset from your inventory to launch an auction protocol and start capturing market offers."
              actionLabel="View Supply Assets"
              onAction={() => navigate("/dashboard/my-products")}
            />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {bids.map((bid) => (
              <li
                key={bid.bid_id}
                className="group flex flex-col md:flex-row md:items-center gap-4 px-5 py-5 hover:bg-paper-dim/50 transition-colors"
              >
                {/* 1. Asset Identity */}
                <div className="flex items-center gap-4 md:w-2/5 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-paper border border-line overflow-hidden shrink-0 flex items-center justify-center">
                    {bid.image_url ? (
                      <img src={bid.image_url} className="h-full w-full object-cover" alt={bid.product_name} />
                    ) : (
                      <Gavel size={18} className="text-ink-muted/50" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-ink truncate font-display">
                        {bid.product_name}
                      </p>
                      <StatusPill status={bid.status} />
                    </div>
                    <p className="text-[11px] font-mono text-ink-soft tracking-wide">
                      LOT QTY: {bid.quantity}
                    </p>
                  </div>
                </div>

                {/* 2. Market Dynamics */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center md:w-1/4 min-w-0 py-2 md:py-0 border-y border-line md:border-none border-dashed">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Top Offer</span>
                    <span className="font-mono font-tabular font-semibold text-ink text-base">
                      ${Number(bid.highest_bid || bid.base_price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end md:items-start md:mt-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Market Volume</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${bid.offer_count > 0 ? 'bg-amber-soft/50 border-amber/20 text-amber-dark' : 'bg-paper border-line text-ink-muted'}`}>
                      {bid.offer_count ?? 0} Pending
                    </span>
                  </div>
                </div>

                {/* 3. Temporal State */}
                <div className="md:w-1/5 flex items-center md:justify-center">
                  {bid.status === "open" ? (
                    <CountdownChip endTime={bid.end_time} />
                  ) : (
                    <span className="text-xs font-mono text-ink-muted">Lifecycle Ended</span>
                  )}
                </div>

                {/* 4. Execution Nodes */}
                <div className="flex items-center gap-2 mt-2 md:mt-0 md:w-auto md:ml-auto shrink-0">
                  
                  {/* Primary Review Action */}
                  <Button 
                    variant={bid.offer_count > 0 ? "accent" : "outline"}
                    size="sm"
                    icon={Inbox}
                    onClick={() => navigate(`/dashboard/my-auctions/${bid.bid_id}/offers`)}
                    className="mr-2 hidden sm:flex"
                  >
                    Review
                  </Button>

                  <div className="flex items-center gap-1 bg-paper border border-line rounded-lg p-1">
                    <Link to={`/auctions/${bid.bid_id}`} title="View Public Listing">
                      <button className="h-8 w-8 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-paper-dim transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </Link>
                    
                    {bid.status === "open" && (
                      <button
                        onClick={() => handleClose(bid)}
                        title="Terminate Early"
                        className="h-8 w-8 flex items-center justify-center rounded-md text-ink-soft hover:text-amber-dark hover:bg-amber-soft transition-colors"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(bid)}
                      title="Purge Record"
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
    </div>
  );
}