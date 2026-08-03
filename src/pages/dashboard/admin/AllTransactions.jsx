import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Receipt, ArrowRight } from "lucide-react";
import { getTransactions } from "../../../api/transactions.api";
import Card from "../../../components/ui/Card";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

export default function AllTransactions() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "transactions", page, typeFilter],
    queryFn: () => getTransactions({ page, limit: 15, transaction_type: typeFilter || undefined }),
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Global Ledger</p>
          <h1 className="font-display font-semibold text-2xl text-ink">All Transactions</h1>
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 px-4 text-sm font-medium bg-white border border-line rounded-full focus:outline-none focus:border-ink transition-colors cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="payment">Payments (Auctions)</option>
          <option value="refund">Refunds</option>
          <option value="warehouse_fee">Warehouse Fees</option>
          <option value="commission">Platform Commissions</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={Receipt} title="No transactions found" description="The ledger is currently empty for this filter." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-paper-dim border-b border-line text-xs uppercase font-mono tracking-widest text-ink-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Txn ID</th>
                  <th className="px-5 py-3.5 font-medium">Flow</th>
                  <th className="px-5 py-3.5 font-medium">Type</th>
                  <th className="px-5 py-3.5 font-medium text-right">Amount</th>
                  <th className="px-5 py-3.5 font-medium text-center">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {transactions.map((tx) => (
                  <tr key={tx.transaction_id} className="hover:bg-paper-dim/40 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-mono text-ink-soft">{tx.reference_id || `TXN-${tx.transaction_id}`}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 text-ink-soft">
                        <span className="truncate max-w-[120px]" title={tx.from_name}>{tx.from_name}</span>
                        <ArrowRight size={14} className="text-ink-muted shrink-0" />
                        <span className="truncate max-w-[120px]" title={tx.to_name}>{tx.to_name}</span>
                      </div>
                      {tx.product_name && (
                        <p className="text-[11px] text-ink-muted mt-0.5 truncate max-w-[250px]">
                          Lot: {tx.product_name}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 capitalize text-ink-soft">
                      {tx.transaction_type.replace("_", " ")}
                    </td>
                    <td className="px-5 py-3 font-mono font-tabular font-medium text-right text-ink">
                      ${Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <StatusPill status={tx.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-ink-muted font-mono">
                      {new Date(tx.transaction_time).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {pagination && (
        <div className="mt-4">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}