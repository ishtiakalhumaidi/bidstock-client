import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Receipt, ArrowRight, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router";
import { getMyTransactions } from "../../../api/transactions.api";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

const STATUS_FILTERS = [
  { id: "all", label: "All Records" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

export default function MyTransactions() {
  const { user } = useAuth(); // Inject Auth Context
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", "mine", page, statusFilter],
    queryFn: () => getMyTransactions({ 
      page, 
      limit: 12, 
      status: statusFilter === "all" ? undefined : statusFilter 
    }),
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Financial Flow</p>
          <h1 className="font-display font-semibold text-2xl text-ink">My Transactions</h1>
        </div>

        <div className="flex bg-paper-dim p-1 rounded-lg border border-line w-max">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
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

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={Receipt} 
              title="No transaction history" 
              description={statusFilter === "all" ? "Your localized financial ledger is currently empty." : `No ${statusFilter} transactions found in your ledger.`} 
            />
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-paper-dim border-b border-line text-xs uppercase font-mono tracking-widest text-ink-muted">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Txn ID</th>
                    <th className="px-5 py-3.5 font-medium">Counterparty</th>
                    <th className="px-5 py-3.5 font-medium">Reference</th>
                    <th className="px-5 py-3.5 font-medium text-right">Amount</th>
                    <th className="px-5 py-3.5 font-medium text-center">Status</th>
                    <th className="px-5 py-3.5 font-medium text-right">Execution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink">
                  {transactions.map((tx) => {
                    const isPayer = user?.user_id === tx.from_id;

                    return (
                      <tr key={tx.transaction_id} className="hover:bg-paper-dim/40 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-mono text-xs text-ink-soft">{tx.reference_id || `TXN-${tx.transaction_id}`}</p>
                          <p className="text-[10px] text-ink-muted mt-0.5">{new Date(tx.transaction_time).toLocaleDateString()}</p>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-ink-soft capitalize text-xs bg-paper-dim px-2 py-0.5 rounded border border-line">
                              {tx.counterparty_role.replace("_", " ")}
                            </span>
                            <span className="font-medium text-ink">{tx.counterparty_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-soft">
                          <p className="truncate max-w-[200px] font-medium text-ink">{tx.product_name || "N/A"}</p>
                          <p className="text-[11px] text-ink-muted capitalize mt-0.5">{tx.transaction_type.replace("_", " ")}</p>
                        </td>
                        <td className="px-5 py-3 font-mono font-tabular font-medium text-right text-ink">
                          ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <StatusPill status={tx.status} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          {/* Role-Based Execution Rendering */}
                          {tx.status === 'pending' && isPayer ? (
                            <Link to={`/dashboard/checkout/${tx.transaction_id}`}>
                              <button className="h-8 px-3 text-xs font-medium inline-flex items-center justify-center rounded bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm">
                                Pay <ArrowRight size={14} className="ml-1" />
                              </button>
                            </Link>
                          ) : tx.status === 'pending' && !isPayer ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-ink-muted bg-paper-dim px-2 py-1 rounded">
                              <Clock size={10} /> Awaiting Buyer
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-line">
              {transactions.map((tx) => {
                const isPayer = user?.user_id === tx.from_id;

                return (
                  <div key={tx.transaction_id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-ink truncate max-w-[200px]">{tx.product_name || "N/A"}</p>
                        <p className="font-mono text-xs text-ink-soft mt-0.5">{tx.reference_id || `TXN-${tx.transaction_id}`}</p>
                      </div>
                      <StatusPill status={tx.status} />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">Counterparty</span>
                        <span className="font-medium text-ink flex items-center gap-1.5">
                          {tx.counterparty_name}
                          <span className="text-[9px] bg-paper-dim border border-line px-1.5 rounded text-ink-soft capitalize">
                            {tx.counterparty_role.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
                          {tx.transaction_type.replace("_", " ")}
                        </span>
                        <span className="font-mono font-tabular font-medium text-ink">
                          ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-line mt-1">
                      <span className="text-xs text-ink-muted">{new Date(tx.transaction_time).toLocaleDateString()}</span>
                      
                      {/* Role-Based Execution Rendering */}
                      {tx.status === 'pending' && isPayer ? (
                        <Link to={`/dashboard/checkout/${tx.transaction_id}`}>
                          <button className="h-7 px-3 text-xs font-medium inline-flex items-center justify-center rounded bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm">
                            Execute Payment <ArrowRight size={12} className="ml-1" />
                          </button>
                        </Link>
                      ) : tx.status === 'pending' && !isPayer ? (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-soft">
                          Awaiting Buyer Payment
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 border-t border-line pt-6">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}