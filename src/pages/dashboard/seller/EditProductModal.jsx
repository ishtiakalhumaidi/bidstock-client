/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Save } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import { Input, Textarea, Select } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { updateProduct } from "../../../api/products.api";

export default function EditProductModal({ product, open, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  // Watch stackable state to toggle the multiplier input dynamically
  const stackable = watch("stackable");

  // Hydrate all spatial and market parameters when the modal targets an asset
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image_url: product.image_url,
        status: product.status,
        weight: product.weight,
        length_cm: product.length_cm,
        width_cm: product.width_cm,
        height_cm: product.height_cm,
        stackable: product.stackable,
        max_stack_count: product.max_stack_count,
      });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => updateProduct(product.product_id, payload),
    onSuccess: () => {
      toast.success("Asset ledger updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Asset update sequence failed."),
  });

  const onSubmit = (data) => {
    // Coerce numeric spatial values to prevent database schema rejections
    mutation.mutate({
      ...data,
      length_cm: data.length_cm ? Number(data.length_cm) : null,
      width_cm: data.width_cm ? Number(data.width_cm) : null,
      height_cm: data.height_cm ? Number(data.height_cm) : null,
      weight: data.weight ? Number(data.weight) : null,
      max_stack_count: data.max_stack_count ? Number(data.max_stack_count) : null,
      stackable: !!data.stackable,
    });
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title="Modify Asset Ledger" maxWidth="max-w-2xl">
      
      {/* Context Anchoring */}
      <div className="mb-6 p-3 bg-paper-dim border border-line rounded-lg flex items-center gap-3">
        <div className="h-10 w-10 bg-white border border-line rounded-md flex items-center justify-center shrink-0">
          <Package size={20} className="text-ink-muted" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Target Asset</p>
          <p className="text-sm font-medium text-ink truncate">{product.name}</p>
        </div>
      </div>

      {/* Internal Scrollable Form Area */}
      <form 
        id="edit-product-form" 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 -mr-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        
        {/* Module 1: Market Data */}
        <div className="space-y-4">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-muted border-b border-line pb-2 mb-4">
            Market Data
          </h4>
          <Input 
            label="Asset Name" 
            required 
            placeholder="Enter asset identifier"
            {...register("name", { required: "Name is required" })} 
          />
          
          <Textarea 
            label="Technical Description" 
            placeholder="Update condition or operational constraints..."
            rows={2}
            {...register("description")} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Base Valuation ($)" 
              type="number" 
              step="0.01" 
              min="0.01"
              {...register("price", { min: 0.01 })} 
            />
            <Select label="System Status" {...register("status")}>
              <option value="active">Active (Visible on network)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </Select>
          </div>

          <Input 
            label="Image URL" 
            type="url" 
            placeholder="https://..."
            {...register("image_url")} 
          />
        </div>

        {/* Module 2: Spatial Logistics */}
        <div className="space-y-4 pt-2">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-muted border-b border-line pb-2 mb-4">
            Spatial Logistics
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Weight (kg)" type="number" step="0.01" {...register("weight")} />
            <Input label="Length (cm)" type="number" step="0.1" min="0.1" {...register("length_cm")} />
            <Input label="Width (cm)" type="number" step="0.1" min="0.1" {...register("width_cm")} />
            <Input label="Height (cm)" type="number" step="0.1" min="0.1" {...register("height_cm")} />
          </div>

          <div className="border-t border-line-strong pt-4 mt-2">
            <label className="flex items-center gap-3 cursor-pointer group w-max">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line-strong text-ink focus:ring-ink accent-[#14181F]"
                {...register("stackable")}
              />
              <span className="text-sm font-medium text-ink group-hover:text-amber-dark transition-colors">
                Enable vertical stacking limits
              </span>
            </label>

            {stackable && (
              <div className="mt-4 max-w-sm animate-in slide-in-from-top-2 fade-in duration-200">
                <Input
                  label="Maximum Vertical Multiplier"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="Auto-calculates if empty"
                  {...register("max_stack_count", { min: { value: 1, message: "Multiplier must be ≥ 1" } })}
                />
              </div>
            )}
          </div>
        </div>
      </form>
      
      {/* Footer Execution Nodes */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-line">
        <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" form="edit-product-form" variant="primary" icon={Save} loading={mutation.isPending} className="w-full sm:w-auto">
          Commit Changes
        </Button>
      </div>
    </Modal>
  );
}