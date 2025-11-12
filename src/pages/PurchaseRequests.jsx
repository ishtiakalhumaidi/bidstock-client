// src/pages/PurchaseRequests.jsx
import { useQuery } from '@tanstack/react-query';
import { fetchMockPurchaseRequests } from '../mocks/data';
import { Link } from 'react-router-dom';
import { FaClock, FaGavel, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { formatDistanceToNow, isPast } from 'date-fns';

const PurchaseRequests = () => {
  const { data: prs = [], isLoading } = useQuery({
    queryKey: ['purchase-requests'],
    queryFn: fetchMockPurchaseRequests,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Bidding Open': return <FaClock className="text-warning" />;
      case 'Bidding Closed': return <FaGavel className="text-info" />;
      case 'Awarded': return <FaCheckCircle className="text-success" />;
      default: return <FaExclamationCircle className="text-error" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      Urgent: 'badge-error',
      High: 'badge-warning',
      Medium: 'badge-info',
      Low: 'badge-ghost',
    };
    return `badge ${colors[priority] || 'badge-ghost'}`;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const past = isPast(date);
    const distance = formatDistanceToNow(date, { addSuffix: true });
    return past ? `Closed ${distance}` : `Closes ${distance}`;
  };

  const viewBids = (pr) => {
    Swal.fire({
      title: `${pr.product} - Bids`,
      html: `
        <div class="text-left">
          <p><strong>Top Bid:</strong> $${pr.topBid.price} by <em>${pr.topBid.supplier}</em></p>
          <p><strong>Delivery:</strong> ${pr.topBid.delivery}</p>
          <p><strong>Total Bids:</strong> ${pr.bidsCount}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Go to Marketplace',
    }).then((result) => {
      if (result.isConfirmed) {
        // Later: navigate to /marketplace/:id
        Swal.fire({ toast: true, icon: 'info', title: 'Opening marketplace...', timer: 1500, position: 'top-end' });
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Purchase Requests</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Open for Bidding</div>
            <div className="stat-value text-primary">
              {prs.filter(p => p.status === 'Bidding Open').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {prs.map((pr) => {
          const isOpen = pr.status === 'Bidding Open';
          const deadline = new Date(pr.deadline);
          const now = new Date();
          const progress = Math.min(100, ((Date.now() - new Date(pr.createdAt)) / (deadline - new Date(pr.createdAt))) * 100);

          return (
            <div key={pr.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={`https://api.dicebear.com/9.x/shapes/svg?seed=PR${pr.id}`}
                          alt={pr.product}
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="card-title">{pr.product}</h2>
                      <p className="text-sm opacity-70">
                        Qty: <strong>{pr.quantity}</strong> {pr.thresholdTriggered && '• Auto-triggered'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={getPriorityBadge(pr.priority)}>{pr.priority}</span>
                    <div className="badge badge-outline gap-1">
                      {getStatusIcon(pr.status)} {pr.status}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bidding Deadline:</span>
                    <span className={`font-mono ${isOpen && !isPast(deadline) ? 'text-success' : 'text-error'}`}>
                      {formatDeadline(pr.deadline)}
                    </span>
                  </div>
                  {isOpen && (
                    <progress
                      className="progress progress-primary w-full"
                      value={progress}
                      max="100"
                    ></progress>
                  )}
                </div>

                <div className="card-actions justify-between items-center mt-4">
                  <div className="text-sm opacity-70">
                    {pr.bidsCount} bid{pr.bidsCount !== 1 ? 's' : ''} received
                    {pr.topBid && (
                      <span className="ml-2 text-success">
                        • Top: ${pr.topBid.price} ({pr.topBid.supplier})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => viewBids(pr)}
                    className="btn btn-sm btn-secondary"
                    disabled={pr.status === 'Awarded'}
                  >
                    {pr.status === 'Awarded' ? `Awarded to ${pr.awardedTo}` : 'View Bids'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-PR Alert */}
      {prs.some(p => p.thresholdTriggered && p.status === 'Bidding Open') && (
        <div className="alert alert-info shadow-lg">
          <FaExclamationCircle />
          <span>
            {prs.filter(p => p.thresholdTriggered && p.status === 'Bidding Open').length} PR(s) were auto-generated due to low stock.
          </span>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;