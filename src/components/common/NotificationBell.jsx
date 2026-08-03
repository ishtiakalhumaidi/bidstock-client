import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Bell, Check, CheckCheck } from "lucide-react";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../../api/notifications.api";
import { useAuth } from "../../hooks/useAuth";
import { timeAgo } from "../../utils/dateUtils"; 

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const queryClient = useQueryClient();

  const { data: countData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 20000,
  });

  const { data: listData, isLoading } = useQuery({
    queryKey: ["notifications", "mine"],
    queryFn: () => getMyNotifications({ limit: 8 }),
    enabled: isAuthenticated && open,
  });

  const unreadCount = countData?.data?.count ?? 0;
  const notifications = listData?.data ?? [];

  const readOne = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const readAll = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-paper-dim text-ink-soft hover:text-ink transition-colors press-scale"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-dark ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-line rounded-2xl shadow-[0_16px_40px_-12px_rgba(20,24,31,0.2)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-paper-dim/30">
            <p className="font-display font-semibold text-sm text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={() => readAll.mutate()}
                className="flex items-center gap-1 text-xs font-medium text-amber-dark hover:text-amber-dark/80 transition-colors"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-paper-dim rounded-lg animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm font-mono text-ink-muted text-center py-10">No system events detected.</p>
            ) : (
              <ul className="divide-y divide-line">
                {notifications.map((n) => (
                  <li
                    key={n.notification_id}
                    className={`px-4 py-3 flex items-start gap-3 transition-colors ${!n.is_read ? "bg-amber-soft/10 hover:bg-amber-soft/20" : "hover:bg-paper-dim/50"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${!n.is_read ? "bg-amber-dark shadow-[0_0_8px_rgba(217,119,6,0.6)]" : "bg-transparent"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.is_read ? "text-ink font-medium" : "text-ink-soft"}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-ink-muted mt-1 font-mono">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => readOne.mutate(n.notification_id)}
                        title="Mark as read"
                        className="p-1 rounded-md text-ink-muted hover:text-amber-dark hover:bg-white border border-transparent hover:border-amber/20 transition-all shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-medium font-mono uppercase tracking-widest text-ink-soft hover:text-ink hover:bg-paper-dim py-3 border-t border-line transition-colors"
          >
            View Event Ledger
          </Link>
        </div>
      )}
    </div>
  );
}