
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMockAdminData } from '../mocks/data';
import { FaUsers, FaGavel, FaChartBar, FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Swal from 'sweetalert2';
import { FaWarehouse } from 'react-icons/fa6';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: admin, isLoading } = useQuery({
    queryKey: ['admin-data'],
    queryFn: fetchMockAdminData,
  });

  const actionMutation = useMutation({
    mutationFn: async ({ type, id, action }) => {
      await delay(600);
      return { success: true, type, id, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-data']);
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Action completed!',
        position: 'top-end',
        timer: 2500,
      });
    },
  });

  const handleVerification = (id, approve) => {
    Swal.fire({
      title: approve ? 'Approve User?' : 'Reject User?',
      text: approve ? 'This supplier will be verified.' : 'This will deny access.',
      icon: approve ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: approve ? 'Approve' : 'Reject',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        actionMutation.mutate({ type: 'verification', id, action: approve ? 'approved' : 'rejected' });
      }
    });
  };

  const resolveDispute = (id, resolution) => {
    Swal.fire({
      title: 'Resolve Dispute',
      input: 'select',
      inputOptions: {
        'Buyer Refund': 'Buyer wins (refund)',
        'Supplier Credit': 'Supplier wins (credit)',
        'Split': 'Split cost',
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        actionMutation.mutate({ type: 'dispute', id, action: result.value });
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Admin Control Center</h1>
        <div className="badge badge-lg badge-success gap-1">
          <FaShieldAlt /> System Online
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <a className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</a>
        <a className={`tab ${activeTab === 'verifications' ? 'tab-active' : ''}`} onClick={() => setActiveTab('verifications')}>Verifications ({admin.pendingVerifications.length})</a>
        <a className={`tab ${activeTab === 'disputes' ? 'tab-active' : ''}`} onClick={() => setActiveTab('disputes')}>Disputes ({admin.activeDisputes.length})</a>
        <a className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</a>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-figure text-primary"><FaChartBar className="w-8 h-8" /></div>
            <div className="stat-title">Total Savings</div>
            <div className="stat-value text-primary">${admin.analytics.totalSavings.toLocaleString()}</div>
            <div className="stat-desc">This month</div>
          </div>

          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-figure text-success"><FaGavel className="w-8 h-8" /></div>
            <div className="stat-title">Avg Bids/PR</div>
            <div className="stat-value text-success">{admin.analytics.avgBidsPerPR}</div>
            <div className="stat-desc">Healthy competition</div>
          </div>

          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-figure text-info"><FaWarehouse className="w-8 h-8" /></div>
            <div className="stat-title">Warehouse Util.</div>
            <div className="stat-value text-info">{admin.analytics.warehouseUtilization}%</div>
            <div className="stat-desc">Across all spaces</div>
          </div>

          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-figure text-secondary"><FaUsers className="w-8 h-8" /></div>
            <div className="stat-title">Rental Income</div>
            <div className="stat-value text-secondary">${admin.analytics.rentalIncome}</div>
            <div className="stat-desc">This quarter</div>
          </div>
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Submitted</th>
                <th>Docs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admin.pendingVerifications.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${v.id}`} />
                        </div>
                      </div>
                      <span className="font-bold">{v.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{v.type}</span></td>
                  <td>{new Date(v.submittedAt).toLocaleDateString()}</td>
                  <td>{v.docs} files</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => handleVerification(v.id, true)} className="btn btn-success btn-xs">
                        <FaCheck />
                      </button>
                      <button onClick={() => handleVerification(v.id, false)} className="btn btn-error btn-xs">
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {admin.activeDisputes.map((d) => (
            <div key={d.id} className="alert shadow-lg">
              <div>
                <FaGavel className="text-warning" />
                <div>
                  <h3 className="font-bold">Dispute #{d.id}</h3>
                  <div className="text-xs">PR #{d.prId} • {d.reason}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`badge ${d.status === 'Open' ? 'badge-warning' : 'badge-info'}`}>
                  {d.status}
                </span>
                <button onClick={() => resolveDispute(d.id)} className="btn btn-sm btn-primary">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid gap-6">
          {/* Top Suppliers */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Top Performing Suppliers</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Supplier</th>
                      <th>Score</th>
                      <th>Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admin.analytics.topSuppliers.map((s, i) => (
                      <tr key={i}>
                        <td>#{i + 1}</td>
                        <td>{s.name}</td>
                        <td>
                          <progress className="progress progress-success w-20" value={s.score} max="100"></progress>
                          <span className="ml-2">{s.score}</span>
                        </td>
                        <td>{s.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Savings Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Monthly Cost Savings</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={admin.analytics.monthlySavings}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Bar dataKey="savings" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;