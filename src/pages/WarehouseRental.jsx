// src/pages/WarehouseRental.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMockWarehouseSpaces, fetchMockRentalRequests } from '../mocks/data';
import { useForm } from 'react-hook-form';
import { FaWarehouse, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaHourglassHalf } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const WarehouseRental = () => {
  const queryClient = useQueryClient();
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [viewMode, setViewMode] = useState('browse'); // 'browse' or 'my-rentals'

  const { data: spaces = [], isLoading: loadingSpaces } = useQuery({
    queryKey: ['warehouse-spaces'],
    queryFn: fetchMockWarehouseSpaces,
  });

  const { data: rentals = [], isLoading: loadingRentals } = useQuery({
    queryKey: ['rental-requests'],
    queryFn: fetchMockRentalRequests,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const rentMutation = useMutation({
    mutationFn: async (data) => {
      await delay(800);
      return { success: true, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rental-requests']);
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Rental request sent!',
        position: 'top-end',
        timer: 3000,
      });
      reset();
      setSelectedSpace(null);
    },
  });

  const onRentSubmit = (data) => {
    const cost = selectedSpace.pricePerSqFt * data.sqFt * ((new Date(data.to) - new Date(data.from)) / (1000 * 60 * 60 * 24 * 30));
    rentMutation.mutate({ ...data, warehouseId: selectedSpace.id, totalCost: cost.toFixed(2) });
  };

  if (loadingSpaces || loadingRentals) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Warehouse Rental</h1>
        <div className="tabs tabs-boxed">
          <a className={`tab ${viewMode === 'browse' ? 'tab-active' : ''}`} onClick={() => setViewMode('browse')}>
            Browse Spaces
          </a>
          <a className={`tab ${viewMode === 'my-rentals' ? 'tab-active' : ''}`} onClick={() => setViewMode('my-rentals')}>
            My Rentals
          </a>
        </div>
      </div>

      {/* Browse Mode */}
      {viewMode === 'browse' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => {
            const availability = ((space.available / space.capacity) * 100).toFixed(0);
            const isAvailable = space.status !== 'Fully Booked';

            return (
              <div key={space.id} className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${space.imageSeed}&size=200`}
                    alt={space.name}
                    className="rounded-xl"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    <FaWarehouse /> {space.name}
                  </h2>
                  <p className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-error" /> {space.location}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <strong>{space.capacity} sq ft</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <strong className={space.available === 0 ? 'text-error' : 'text-success'}>
                        {space.available} sq ft
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <strong className="text-primary">${space.pricePerSqFt}/sq ft/month</strong>
                    </div>
                  </div>

                  <progress
                    className={`progress ${availability > 50 ? 'progress-success' : availability > 20 ? 'progress-warning' : 'progress-error'}`}
                    value={availability}
                    max="100"
                  ></progress>

                  <div className="badge badge-outline mt-2">{space.status}</div>

                  <div className="card-actions mt-4">
                    <button
                      onClick={() => setSelectedSpace(space)}
                      className="btn btn-primary btn-sm w-full"
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Request Rental' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Rentals Mode */}
      {viewMode === 'my-rentals' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Sq Ft</th>
                <th>Period</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-base-300">
                    No rental requests yet.
                  </td>
                </tr>
              ) : (
                rentals.map((r) => {
                  const space = spaces.find(s => s.id === r.warehouseId);
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaWarehouse />
                          <div>
                            <div className="font-bold">{space?.name}</div>
                            <div className="text-sm opacity-70">{space?.location}</div>
                          </div>
                        </div>
                      </td>
                      <td>{r.sqFt} sq ft</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {format(new Date(r.from), 'MMM d')} - {format(new Date(r.to), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="font-mono">${r.totalCost}</td>
                      <td>
                        <div className={`badge ${
                          r.status === 'Approved' ? 'badge-success' :
                          r.status === 'Pending' ? 'badge-warning' : 'badge-error'
                        } gap-1`}>
                          {r.status === 'Approved' ? <FaCheck /> : <FaHourglassHalf />}
                          {r.status}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Rental Request Modal */}
      {selectedSpace && (
        <dialog open className="modal">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">Rent: {selectedSpace.name}</h3>
            <p className="text-sm opacity-70">{selectedSpace.location}</p>

            <form onSubmit={handleSubmit(onRentSubmit)} className="space-y-4 mt-6">
              <div className="form-control">
                <label className="label"><span className="label-text">Square Footage</span></label>
                <input
                  type="number"
                  {...register('sqFt', { required: true, min: 1, max: selectedSpace.available })}
                  className={`input input-bordered ${errors.sqFt ? 'input-error' : ''}`}
                  placeholder={`Max: ${selectedSpace.available}`}
                />
                {errors.sqFt && <span className="text-error text-xs">Valid amount required</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">From</span></label>
                  <input
                    type="date"
                    {...register('from', { required: true })}
                    min={selectedSpace.availability.from}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">To</span></label>
                  <input
                    type="date"
                    {...register('to', { required: true })}
                    min={watch('from') || selectedSpace.availability.from}
                    max={selectedSpace.availability.to}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="alert alert-info text-sm">
                <strong>Est. Cost:</strong> ${(selectedSpace.pricePerSqFt * (watch('sqFt') || 0) * 3).toFixed(2)} (3 months)
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary" disabled={rentMutation.isPending}>
                  {rentMutation.isPending ? 'Sending...' : 'Send Request'}
                </button>
                <button type="button" onClick={() => setSelectedSpace(null)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default WarehouseRental;