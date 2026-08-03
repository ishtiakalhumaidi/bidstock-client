import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2, AlertTriangle, Gavel, RefreshCcw, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { getMyNotifications, markAsRead, markAllAsRead } from "../../../api/notifications.api";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

// --- TIMEZONE FIX UTILITY ---
function parseCorrectedDate(dateStr) {
  if (!dateStr) return new Date();
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6); // Add 6 hours to fix backend offset
  return date;
}

function formatLocalTime(dateStr) {
  if (!dateStr) return "";
  const date = parseCorrectedDate(dateStr);
  return date.toLocaleString(); 
}

const ICON_MAP = {
  inventory_alert: <AlertTriangle size={16} className="text-red" />,
  bid_update: <Gavel size={16} className="text-amber-dark" />,
  transaction: <RefreshCcw size={16} className="text-teal" />,
  system: <Bell size={16} className="text-ink-muted" />
};

export default function Notifications() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "mine", page],
    queryFn: () => getMyNotifications({ page, limit: 15 }),
  });

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const readAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("All alerts marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Global Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8" data-aos="fade-up">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Bell size={12} className="text-amber-dark" />
            System Feed {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Notifications</h1>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            icon={CheckCheck}
            onClick={() => readAllMutation.mutate()}
            loading={readAllMutation.isPending}
            className="w-full sm:w-auto shadow-sm"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification Matrix */}
      <div className="bg-white/80 backdrop-blur-md border border-line rounded-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="Your alert stream is clean. You're all caught up on system events."
            />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {notifications.map((notif) => (
              <li 
                key={notif.notification_id} 
                className={`p-5 flex items-start gap-4 transition-colors relative ${
                  notif.is_read ? 'bg-white/50 opacity-75' : 'bg-amber-soft/10 hover:bg-amber-soft/20'
                }`}
              >
                {/* Unread Accent Bar */}
                {!notif.is_read && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-dark" />
                )}

                <div className="mt-0.5 h-10 w-10 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0 shadow-sm">
                  {ICON_MAP[notif.type] || ICON_MAP.system}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-sm leading-relaxed ${notif.is_read ? 'text-ink-soft' : 'text-ink font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1.5 font-mono">
                    {/* Applying the formatLocalTime fix here */}
                    {formatLocalTime(notif.created_at)}
                  </p>
                </div>

                {/* Professional Text-Action */}
                <div className="shrink-0 self-center">
                  {!notif.is_read ? (
                    <button 
                      onClick={() => readMutation.mutate(notif.notification_id)}
                      disabled={readMutation.isPending}
                      className="text-xs font-medium font-mono uppercase tracking-wider text-amber-dark bg-white border border-amber/30 px-3 py-1.5 rounded-md hover:bg-amber-dark hover:text-white transition-all shadow-sm press-scale"
                    >
                      Mark read
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-mono text-ink-muted/60">
                      <CheckCircle2 size={14} className="text-teal" /> Read
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
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