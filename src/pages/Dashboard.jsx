import { useQuery } from '@tanstack/react-query';
import { fetchMockInventory } from '../mocks/data';

const Dashboard = () => {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchMockInventory,
  });

  if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Inventory Items</div>
          <div className="stat-value">{inventory.length}</div>
        </div>
      </div>
      {/* Add more cards for bids, rentals, etc. */}
    </div>
  );
};

export default Dashboard;