import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { WarehouseIcon, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import Card, { CardHeader, CardBody } from "../../../components/ui/Card";
import { addWarehouse } from "../../../api/warehouse.api";

export default function AddWarehouse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      addWarehouse({
        ...data,
        capacity: Number(data.capacity),
        price_per_day: Number(data.price_per_day),
        floor_area_sqm: data.floor_area_sqm ? Number(data.floor_area_sqm) : null,
        ceiling_height_m: data.ceiling_height_m ? Number(data.ceiling_height_m) : null,
      }),
    onSuccess: () => {
      toast.success("Warehouse added to floor");
      queryClient.invalidateQueries({ queryKey: ["warehouses", "mine"] });
      navigate("/dashboard/my-warehouses");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add warehouse"),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-8" data-aos="fade-up">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
          <Cpu size={12} className="text-teal" /> Space Allocation Node
        </p>
        <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Add a Warehouse</h1>
      </div>

      {/* Balanced 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-ink/10">
            <CardHeader eyebrow="Specification" title="Facility Parameters" />
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Location Identifier"
                  required
                  placeholder="e.g. Sector 7, Industrial Zone, Dhaka"
                  error={errors.location?.message}
                  {...register("location", {
                    required: "Location is required",
                    maxLength: { value: 255, message: "Exceeds character limit" },
                  })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Capacity (Units / Pallets)"
                    required
                    type="number"
                    min="1"
                    placeholder="1000"
                    error={errors.capacity?.message}
                    {...register("capacity", {
                      required: "Capacity is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be a positive integer" },
                    })}
                  />
                  <Input
                    label="Base Rate / Day ($)"
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    error={errors.price_per_day?.message}
                    {...register("price_per_day", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    })}
                  />
                </div>

                <div className="pt-4 border-t border-line/60">
                  <p className="text-sm font-medium text-ink mb-1">Spatial Dimensions (Optional)</p>
                  <p className="text-xs text-ink-muted mb-5 leading-relaxed">
                    Configure precise physical dimensions to enable automated square-meter mapping during tenant procurement cycles.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Floor Area (sqm)"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g. 500"
                      error={errors.floor_area_sqm?.message}
                      {...register("floor_area_sqm", { 
                        valueAsNumber: true,
                        min: { value: 0.1, message: "Must be positive" } 
                      })}
                    />
                    <Input
                      label="Ceiling Clearance (m)"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g. 4.5"
                      error={errors.ceiling_height_m?.message}
                      {...register("ceiling_height_m", { 
                        valueAsNumber: true,
                        min: { value: 0.1, message: "Must be positive" } 
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-line/60">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    icon={WarehouseIcon} 
                    loading={mutation.isPending}
                    className="w-full sm:w-auto shadow-sm"
                  >
                    Deploy Facility
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Premium Context / Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-paper-dim/60 border border-line rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 text-teal font-medium text-xs font-mono uppercase tracking-widest">
              <ShieldCheck size={16} /> Secure Registration
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">Network Protocol</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Once registered, your facility node will be broadcasted to active procurement channels. Tenants can inspect dimensions and initiate automated reverse-bidding leases.
            </p>
            <div className="pt-2 border-t border-line/60 text-[11px] text-ink-muted font-mono">
              Status: Ready for deployment
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}