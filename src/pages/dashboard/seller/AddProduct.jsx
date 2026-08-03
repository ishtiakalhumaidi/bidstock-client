import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { PackagePlus, Box, Info } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Select } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import Card, { CardHeader, CardBody } from "../../../components/ui/Card";
import { addProduct } from "../../../api/products.api";

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { status: "active", stackable: true } });

  const stackable = watch("stackable");

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Product successfully registered in the system.");
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
      navigate("/dashboard/my-products");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Registration failed. Check system logs."),
  });

  const onSubmit = (data) =>
    mutation.mutate({
      ...data,
      length_cm: data.length_cm ? Number(data.length_cm) : null,
      width_cm: data.width_cm ? Number(data.width_cm) : null,
      height_cm: data.height_cm ? Number(data.height_cm) : null,
      max_stack_count: data.max_stack_count ? Number(data.max_stack_count) : null,
      stackable: !!data.stackable,
    });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">Inventory Pipeline</p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Register Asset</h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/my-products")}
          className="hidden sm:flex"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Module 1: Market Data */}
        <Card>
          <CardHeader 
            title="Market Parameters" 
            eyebrow="Module 01" 
            className="bg-paper-dim/30"
          />
          <CardBody className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Asset Name"
                required
                placeholder="e.g., Industrial Shelving Unit — 5 Tier"
                error={errors.name?.message}
                className="md:col-span-2"
                {...register("name", { required: "Asset name is required" })}
              />

              <Textarea
                label="Technical Description"
                placeholder="Define condition, material specifications, and operational constraints."
                className="md:col-span-2"
                rows={3}
                {...register("description")}
              />

              <Input
                label="Base Valuation (USD)"
                required
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register("price", {
                  required: "Valuation is required",
                  min: { value: 0.01, message: "Valuation must be > 0" },
                })}
              />
              
              <Select label="System Category" {...register("category")}>
                <option value="">Assign classification...</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="apparel">Apparel</option>
                <option value="industrial">Industrial Equipment</option>
                <option value="packaged_goods">Packaged Goods</option>
                <option value="other">Unclassified</option>
              </Select>

              <Input label="Manufacturer / Brand" placeholder="Optional identifier" {...register("brand")} />
              <Input label="Packaging Unit" placeholder="e.g., per pallet, crate" {...register("size")} />
              
              <Input
                label="Asset Image URL"
                type="url"
                placeholder="https://storage.provider.com/asset.jpg"
                className="md:col-span-2"
                {...register("image_url")}
              />
            </div>
          </CardBody>
        </Card>

        {/* Module 2: Spatial & Logistics Data */}
        <Card>
          <CardHeader 
            title="Spatial Logistics" 
            eyebrow="Module 02" 
            className="bg-paper-dim/30"
          />
          <CardBody>
            <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-amber-soft/50 border border-amber/20 text-sm text-ink-soft">
              <Info size={16} className="text-amber-dark shrink-0 mt-0.5" />
              <p>
                Precise spatial metrics are strictly required to calculate volumetric efficiency when reserving warehouse space. Inaccurate data will result in rejected storage requests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("weight")}
              />
              <Input
                label="Length (cm)"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                error={errors.length_cm?.message}
                {...register("length_cm", { min: { value: 0.1, message: "Invalid metric" } })}
              />
              <Input
                label="Width (cm)"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                error={errors.width_cm?.message}
                {...register("width_cm", { min: { value: 0.1, message: "Invalid metric" } })}
              />
              <Input
                label="Height (cm)"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                error={errors.height_cm?.message}
                {...register("height_cm", { min: { value: 0.1, message: "Invalid metric" } })}
              />
            </div>

            <div className="border-t border-line pt-5">
              <label className="flex items-center gap-3 cursor-pointer group w-max">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line-strong text-ink focus:ring-ink accent-[#14181F]"
                  {...register("stackable")}
                />
                <span className="text-sm font-medium text-ink group-hover:text-amber-dark transition-colors">
                  Enable vertical stacking limits for this asset
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
                    hint="Define absolute limits for fragile physical assets."
                    {...register("max_stack_count", { min: { value: 1, message: "Multiplier must be ≥ 1" } })}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Execution Node */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/my-products")} className="sm:hidden">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" icon={PackagePlus} loading={mutation.isPending}>
            Commit to Database
          </Button>
        </div>
      </form>
    </div>
  );
}