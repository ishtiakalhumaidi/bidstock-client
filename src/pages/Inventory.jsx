// src/pages/Inventory.jsx
import { useQuery } from '@tanstack/react-query';
import { fetchMockInventory } from '../mocks/data';
import { Link } from 'react-router-dom';
import { FaPlus, FaWarehouse, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Inventory = () => {
  const { data: inventory = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchMockInventory,
  });

  const handleCreatePR = (item) => {
    Swal.fire({
      title: `Create PR for ${item.product}?`,
      text: `Stock: ${item.stock} < Threshold: ${item.threshold}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create PR!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `PR created for ${item.product}`,
          timer: 3000,
          showConfirmButton: false,
        });
        // Later: mutate to create PR via API
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error">Failed to load inventory.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Inventory Management</h1>
        <Link to="/inventory/add" className="btn btn-primary">
          <FaPlus /> Add Product
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isLow = item.stock < item.threshold;
                  return (
                    <tr key={item.id} className={isLow ? 'bg-error/10' : ''}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img
                                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${item.product}`}
                                alt={item.product}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{item.product}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaWarehouse className="text-info" />
                          <span>Warehouse {item.id % 2 === 0 ? 'B' : 'A'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-lg ${isLow ? 'text-error' : 'text-success'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="font-mono">{item.threshold}</td>
                      <td>
                        <div className="badge badge-lg gap-1">
                          {isLow ? (
                            <>
                              <FaExclamationTriangle /> Low Stock
                            </>
                          ) : (
                            'Normal'
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleCreatePR(item)}
                          className="btn btn-sm btn-secondary"
                          disabled={!isLow}
                        >
                          Create PR
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Summary */}
      {inventory.some(i => i.stock < i.threshold) && (
        <div className="alert alert-warning shadow-lg">
          <FaExclamationTriangle />
          <span>
            {inventory.filter(i => i.stock < i.threshold).length} item(s) below threshold. 
            Auto-PR will be generated soon.
          </span>
        </div>
      )}
    </div>
  );
};

export default Inventory;