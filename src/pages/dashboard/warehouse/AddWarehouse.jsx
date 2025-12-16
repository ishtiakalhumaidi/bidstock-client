import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Warehouse,
  MapPin,
  Maximize,
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/auth.api";

export default function AddWarehouse() {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        owner_id: user.user_id,
        capacity: parseFloat(data.capacity),
        price: parseFloat(data.price),
      };
      console.log(payload);
      return api.post("/warehouses", payload);
    },
    onSuccess: () => {
      navigate("/dashboard/warehouses");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative w-full h-full min-h-[80vh] overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-200">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-100/40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full h-full bg-white/60 backdrop-blur-md p-6 sm:p-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/20">
              <Warehouse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                List New Warehouse
              </h2>
              <p className="text-zinc-500 text-sm">
                Monetize your unused storage capacity
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/warehouses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col gap-6 max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Warehouse Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  type="text"
                  placeholder="e.g. 123 Logistics Blvd, New York, NY"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.location
                      ? "border-red-500"
                      : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                  } bg-white/80 focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Total Capacity (sq ft)
              </label>
              <div className="relative">
                <Maximize className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  {...register("capacity", {
                    required: "Capacity is required",
                    min: { value: 1, message: "Capacity must be positive" },
                  })}
                  type="number"
                  placeholder="e.g. 5000"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.capacity
                      ? "border-red-500"
                      : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                  } bg-white/80 focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.capacity && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            {/* Price (New Field) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Monthly Rent Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1500.00"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.price
                      ? "border-red-500"
                      : "border-zinc-200 focus:border-rose-500 focus:ring-rose-500"
                  } bg-white/80 focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Visual Placeholder for "Type" */}
            <div className="md:col-span-2 space-y-1.5 opacity-50 pointer-events-none">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Facility Type (Auto-detected)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  disabled
                  type="text"
                  placeholder="General Storage"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100/50"
                />
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Owner Verification</p>
              <p className="opacity-80">
                This warehouse will be registered under your account (ID:{" "}
                {user?.user_id}). Ensure the location address matches your
                business registration documents.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-zinc-200/50 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {mutation.isPending ? "Registering..." : "Register Warehouse"}
              {!mutation.isPending && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </form>

        {mutation.isError && (
          <p className="text-sm text-red-600 text-center mt-4 bg-red-50 py-2 rounded-lg border border-red-100">
            {mutation.error.response?.data?.message ||
              "Failed to add warehouse. Please try again."}
          </p>
        )}
      </motion.div>
    </div>
  );
}
