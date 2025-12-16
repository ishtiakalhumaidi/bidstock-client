import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Tag,
  Scale,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Layers,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import api from "../../../api/auth.api";

export default function AddProduct() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/products", data),
    onSuccess: () => {
      navigate("/dashboard/my-product");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "active",
      rating: 0,
      total_reviews: 0,
      total_sales: 0,
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      weight: parseFloat(data.weight),
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="relative w-full h-full min-h-[80vh] overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-200">
      {/* Background Decor (Stretched to cover full dashboard area) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-100/40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full h-full bg-white/60 backdrop-blur-md p-6 sm:p-10 flex flex-col"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/20">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                List New Product
              </h2>
              <p className="text-zinc-500 text-sm">
                Add inventory to your store
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/inventory"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col gap-6"
        >
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Product Name
                </label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="e.g. Sony IMX Sensors (Batch of 500)"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white/80 focus:ring-2 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Description
                </label>
                <div className="relative h-full">
                  <FileText className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                  <textarea
                    {...register("description")}
                    rows="5"
                    placeholder="Detailed specifications..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white/80 focus:ring-2 focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                  <input
                    {...register("image_url")}
                    type="url"
                    placeholder="https://example.com/product.jpg"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white/80 focus:ring-2 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Details & Status */}
            <div className="space-y-6">
              {/* Price & Weight Group */}
              <div className="bg-white/50 p-6 rounded-2xl border border-zinc-100 space-y-5">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <input
                      {...register("price", { required: true, min: 0 })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white focus:ring-2 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <input
                      {...register("weight", { required: true, min: 0 })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white focus:ring-2 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category Group */}
              <div className="bg-white/50 p-6 rounded-2xl border border-zinc-100 space-y-5">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">
                    Category
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <input
                      {...register("category", { required: true })}
                      type="text"
                      placeholder="Electronics"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white focus:ring-2 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">
                    Brand
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <input
                      {...register("brand", { required: true })}
                      type="text"
                      placeholder="Sony"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white focus:ring-2 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">
                    Status
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <select
                      {...register("status")}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-rose-500 bg-white focus:ring-2 focus:outline-none transition-all appearance-none text-zinc-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-zinc-200/50 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {mutation.isPending ? "Saving..." : "Create Product"}
              {!mutation.isPending && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </form>

        {mutation.isError && (
          <p className="text-sm text-red-600 text-center mt-4 bg-red-50 py-2 rounded-lg border border-red-100">
            {mutation.error.response?.data?.message ||
              "Failed to create product."}
          </p>
        )}
      </motion.div>
    </div>
  );
}
