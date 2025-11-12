// src/pages/Marketplace.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMockOpenPRs, mockBidLeaderboard } from '../mocks/data';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaClock, FaTrophy, FaEdit, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { formatDistanceToNow, isPast } from 'date-fns';
import { useState } from 'react';

const Marketplace = () => {
  const queryClient = useQueryClient();
  const { data: prs = [], isLoading } = useQuery({
    queryKey: ['open-prs'],
    queryFn: fetchMockOpenPRs,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [selectedPR, setSelectedPR] = useState(null);

  const bidMutation = useMutation({
    mutationFn: async (bidData) => {
      await delay(600);
      return { success: true, ...bidData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['open-prs']);
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Bid submitted!',
        position: 'top-end',
        timer: 3000,
      });
      reset();
      setSelectedPR(null);
    },
  });

  const onSubmitBid = (data) => {
    bidMutation.mutate({ prId: selectedPR.id, ...data });
  };

  const openBidModal = (pr) => {
    setSelectedPR(pr);
    reset(pr.yourBid || { price: '', delivery: '', warranty: '6 months' });
  };

  const getLeaderboard = (prId) => mockBidLeaderboard(prId);

  if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Bidding Marketplace</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Open PRs</div>
            <div className="stat-value text-primary">{prs.length}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
       {prs.map((pr) => {
        const leaderboard = Array.isArray(getLeaderboard(pr.id)) ? getLeaderboard(pr.id) : [];
        const yourRank = leaderboard.findIndex(b => b.supplier.includes('You')) + 1;
        const isDeadlineSoon = !isPast(new Date(pr.deadline)) &&
          new Date(pr.deadline) - new Date() < 24 * 60 * 60 * 1000;

          return (
            <div key={pr.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">{pr.product}</h2>
                    <p className="text-sm opacity-70">
                      <strong>{pr.quantity}</strong> units • {pr.business}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="badge badge-lg badge-warning gap-1">
                      <FaClock /> {formatDistanceToNow(new Date(pr.deadline), { addSuffix: true })}
                    </div>
                    {isDeadlineSoon && <div className="text-xs text-error mt-1">Closes soon!</div>}
                  </div>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <span>Avg Bid: <strong>${pr.avgBid.toFixed(2)}</strong></span>
                  <span>{pr.totalBids} bid{pr.totalBids !== 1 ? 's' : ''}</span>
                </div>

                {pr.yourBid && (
                  <div className="alert alert-success text-sm mt-3">
                    <FaTrophy /> Your bid: <strong>${pr.yourBid.price}</strong> • {pr.yourBid.delivery}
                  </div>
                )}

                <div className="card-actions justify-between mt-4">
                  <button
                    onClick={() => openBidModal(pr)}
                    className={`btn btn-sm ${pr.yourBid ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {pr.yourBid ? <><FaEdit /> Update Bid</> : <><FaPaperPlane /> Place Bid</>}
                  </button>
                  {yourRank > 0 && (
                    <div className="badge badge-lg badge-accent">
                      Your Rank: #{yourRank}
                    </div>
                  )}
                </div>

                {/* Mini Leaderboard */}
                {leaderboard.length > 0 && (
                  <details className="dropdown mt-3">
                    <summary className="btn btn-ghost btn-xs">View Leaderboard</summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-64">
                      {leaderboard.map((bid, i) => (
                        <li key={i} className={bid.supplier.includes('You') ? 'bg-success/20' : ''}>
                          <a>
                            <span className="font-bold">#{i + 1}</span> {bid.supplier} • 
                            <strong>${bid.price}</strong> • {bid.delivery}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bid Submission Modal */}
      {selectedPR && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Place Bid: {selectedPR.product}</h3>
            <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Unit Price ($)</span></label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: true, min: 0.01 })}
                  className={`input input-bordered ${errors.price ? 'input-error' : ''}`}
                  placeholder="e.g. 9.80"
                />
                {errors.price && <span className="text-error text-xs">Valid price required</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Delivery Time</span></label>
                <input
                  type="text"
                  {...register('delivery', { required: true })}
                  className={`input input-bordered ${errors.delivery ? 'input-error' : ''}`}
                  placeholder="e.g. 2 days"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Warranty</span></label>
                <select {...register('warranty')} className="select select-bordered">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2 years</option>
                </select>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary" disabled={bidMutation.isPending}>
                  {bidMutation.isPending ? 'Submitting...' : 'Submit Bid'}
                </button>
                <button type="button" onClick={() => setSelectedPR(null)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Marketplace;