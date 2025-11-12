import { useQuery } from '@tanstack/react-query';
import { fetchMockSupplierPerformance } from '../mocks/data';
import { FaTrophy, FaClock, FaTruck, FaStar, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Swal from 'sweetalert2';

const SupplierPerformance = () => {
  const { data: perf, isLoading } = useQuery({
    queryKey: ['supplier-performance'],
    queryFn: fetchMockSupplierPerformance,
  });

  const showInsight = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#3085d6',
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  const winRate = ((perf.wonBids / perf.totalBids) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${perf.supplierId}`} alt="Supplier" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{perf.name}</h1>
            <p className="text-sm opacity-70">Supplier ID: {perf.supplierId}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{perf.rating}/5.0</div>
          <div className="flex justify-end gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(perf.rating) ? 'text-warning' : 'text-base-300'} />
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <FaTrophy className="w-8 h-8" />
          </div>
          <div className="stat-title">Win Rate</div>
          <div className="stat-value text-primary">{winRate}%</div>
          <div className="stat-desc">21 of 48 bids</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-success">
            <FaTruck className="w-8 h-8" />
          </div>
          <div className="stat-title">Delivery Accuracy</div>
          <div className="stat-value text-success">{perf.deliveryAccuracy}%</div>
          <div className="stat-desc">On-spec deliveries</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-info">
            <FaClock className="w-8 h-8" />
          </div>
          <div className="stat-title">On-Time Rate</div>
          <div className="stat-value text-info">{perf.onTimeRate}%</div>
          <div className="stat-desc">Within deadline</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <FaChartLine className="w-8 h-8" />
          </div>
          <div className="stat-title">Price Score</div>
          <div className="stat-value text-secondary">{perf.averagePriceCompetitiveness}</div>
          <div className="stat-desc">vs market avg</div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="flex justify-center gap-8 flex-wrap">
        <div className="text-center">
          <div className="radial-progress text-primary" style={{ "--value": winRate, "--size": "6rem" }}>
            {winRate}%
          </div>
          <div className="mt-2 font-semibold">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="radial-progress text-success" style={{ "--value": perf.deliveryAccuracy, "--size": "6rem" }}>
            {perf.deliveryAccuracy}%
          </div>
          <div className="mt-2 font-semibold">Delivery</div>
        </div>
        <div className="text-center">
          <div className="radial-progress text-info" style={{ "--value": perf.onTimeRate, "--size": "6rem" }}>
            {perf.onTimeRate}%
          </div>
          <div className="mt-2 font-semibold">On-Time</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Bid & Win Trend (Last 4 Months)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perf.monthlyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bids" stroke="#8b5cf6" name="Bids Placed" />
                <Line type="monotone" dataKey="wins" stroke="#10b981" name="Bids Won" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Awards */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Awards</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>PR ID</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {perf.recentAwards.map((award) => (
                  <tr key={award.prId}>
                    <td>{award.prId}</td>
                    <td>{award.product}</td>
                    <td>{new Date(award.date).toLocaleDateString()}</td>
                    <td>${award.price}</td>
                    <td>
                      <span className={`badge ${
                        award.status === 'Delivered' ? 'badge-success' :
                        award.status === 'Shipped' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {award.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {perf.disputes > 0 && (
            <div className="alert alert-warning mt-4">
              <FaExclamationTriangle />
              <span>{perf.disputes} dispute(s) in record. <a href="#" className="link" onClick={() => showInsight('Dispute History', 'View and resolve past disputes to improve rating.')}>View Details</a></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformance;