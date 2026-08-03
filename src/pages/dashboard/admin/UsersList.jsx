import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Ban, Trash2, CheckCircle2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { getUsers, updateUser, deleteUser } from "../../../api/users.api";
import Card from "../../../components/ui/Card";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";
import { confirmAction } from "../../../lib/confirm";

export default function UsersList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, roleFilter],
    queryFn: () => getUsers({ page, limit: 12, role: roleFilter || undefined }),
  });

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, newStatus }) => updateUser(userId, { status: newStatus }),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update status"),
  });

  const removeMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User permanently deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete user"),
  });

  const handleToggleStatus = async (user) => {
    const isSuspending = user.status === "active";
    const action = isSuspending ? "Suspend" : "Reactivate";
    
    const ok = await confirmAction({
      title: `${action} this user?`,
      text: isSuspending 
        ? `${user.name} will be blocked from logging in or participating in the platform.`
        : `${user.name} will regain full access to their account.`,
      confirmText: action,
      danger: isSuspending,
    });

    if (ok) {
      toggleStatusMutation.mutate({ 
        userId: user.user_id, 
        newStatus: isSuspending ? "suspended" : "active" 
      });
    }
  };

  const handleDelete = async (user) => {
    const ok = await confirmAction({
      title: "Delete user permanently?",
      text: "This action cannot be undone. Users with active rentals or open auctions cannot be deleted.",
      confirmText: "Delete User",
      danger: true,
    });
    if (ok) removeMutation.mutate(user.user_id);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Platform Control</p>
          <h1 className="font-display font-semibold text-2xl text-ink">User Directory</h1>
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 px-4 text-sm font-medium bg-white border border-line rounded-full focus:outline-none focus:border-ink transition-colors cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="warehouse_owner">Warehouse Owners</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={Users} title="No users found" description="Adjust your filters to see more results." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-paper-dim border-b border-line text-xs uppercase font-mono tracking-widest text-ink-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">User</th>
                  <th className="px-5 py-3.5 font-medium">Role</th>
                  <th className="px-5 py-3.5 font-medium text-center">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-paper-dim/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-paper-dim border border-line flex items-center justify-center overflow-hidden shrink-0">
                          {user.user_image ? (
                            <img src={user.user_image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Users size={16} className="text-ink-muted" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{user.name}</p>
                          <p className="text-xs text-ink-soft">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft capitalize">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1.5 text-amber-dark font-medium">
                          <Shield size={14} /> Admin
                        </span>
                      ) : (
                        user.role.replace("_", " ")
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <StatusPill status={user.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                                user.status === 'active' 
                                  ? 'text-ink-soft hover:bg-red-soft hover:text-red' 
                                  : 'text-ink-soft hover:bg-teal-soft hover:text-teal'
                              }`}
                              title={user.status === 'active' ? 'Suspend user' : 'Reactivate user'}
                            >
                              {user.status === 'active' ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="h-8 w-8 rounded flex items-center justify-center text-ink-soft hover:bg-red-soft hover:text-red transition-colors"
                              title="Delete user"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
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