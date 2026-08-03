import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Boxes, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Select } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import Card, { CardHeader, CardBody } from "../../../components/ui/Card";
import { addInventory } from "../../../api/inventory.api";
import { getSellerProducts } from "../../../api/products.api";
import { getMyRents } from "../../../api/rents.api";
import { getSingleWarehouse } from "../../../api/warehouse.api";

const DEFAULT_DIM_CM = 30;

function calculateSpaceUsed(product, quantity, ceilingHeightM) {
  const lengthCm = product?.length_cm || DEFAULT_DIM_CM;
  const widthCm = product?.width_cm || DEFAULT_DIM_CM;
  const heightCm = product?.height_cm || DEFAULT_DIM_CM;

  const footprintSqm = (lengthCm / 100) * (widthCm / 100);

  let stackCount = 1;
  if (product?.stackable ?? true) {
    const heightM = heightCm / 100;
    const byCeiling = heightM > 0 ? Math.floor((ceilingHeightM || 3) / heightM) : 1;
    const byMax = product?.max_stack_count || Infinity;
    stackCount = Math.max(1, Math.min(byCeiling, byMax));
  }

  return Math.ceil(quantity / stackCount) * footprintSqm;
}

export default function AddInventory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products", "mine", "all"],
    queryFn: () => getSellerProducts({ limit: 100, status: "active" }),
  });

  const { data: rentsData, isLoading: loadingRents } = useQuery({
    queryKey: ["rents", "mine", "active"],
    queryFn: () => getMyRents({ limit: 100, status: "active" }),
  });

  const products = productsData?.data ?? [];
  const rents = rentsData?.data ?? [];

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedProductId = watch("product_id");
  const selectedWarehouseId = watch("warehouse_id");
  const quantity = Number(watch("quantity")) || 0;

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.product_id) === String(selectedProductId)),
    [products, selectedProductId],
  );

  const { data: warehouseData, isLoading: loadingWarehouseDetail } = useQuery({
    queryKey: ["warehouses", selectedWarehouseId],
    queryFn: () => getSingleWarehouse(selectedWarehouseId),
    enabled: !!selectedWarehouseId,
  });

  const warehouse = warehouseData?.data;

  const liveCalc = useMemo(() => {
    if (!warehouse || !selectedProduct || quantity <= 0) return null;

    const usesSpaceModel = warehouse.floor_area_sqm !== null && warehouse.floor_area_sqm !== undefined;

    if (usesSpaceModel) {
      const additionalSqm = calculateSpaceUsed(selectedProduct, quantity, warehouse.ceiling_height_m);
      const currentUsed = Number(warehouse.space_used_sqm) || 0;
      const total = Number(warehouse.floor_area_sqm) || 0;
      const projectedUsed = currentUsed + additionalSqm;
      const remaining = total - projectedUsed;

      return {
        mode: "space",
        additionalSqm,
        currentUsed,
        total,
        projectedUsed,
        remaining,
        overCapacity: remaining < 0,
      };
    }

    const currentUsedQty = Number(warehouse.used_quantity) || 0;
    const capacity = Number(warehouse.capacity) || 0;
    const projectedQty = currentUsedQty + quantity;
    const remaining = capacity - projectedQty;

    return {
      mode: "count",
      currentUsedQty,
      capacity,
      projectedQty,
      remaining,
      overCapacity: remaining < 0,
    };
  }, [warehouse, selectedProduct, quantity]);

  const mutation = useMutation({
    mutationFn: addInventory,
    onSuccess: (res) => {
      toast.success(res.message || "Inventory committed to ledger.");
      queryClient.invalidateQueries({ queryKey: ["inventory", "mine"] });
      navigate("/dashboard/my-inventory");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Execution failed."),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">Stock Logistics</p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Allocate Inventory</h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/my-inventories")}
          className="hidden sm:flex"
        >
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-md">
            <CardHeader eyebrow="Module 01" title="Routing Parameters" className="bg-paper-dim/30" />
            <CardBody>
              <form id="inventory-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <Select
                  label="Target Asset"
                  required
                  disabled={loadingProducts}
                  error={errors.product_id?.message}
                  {...register("product_id", { required: "Target asset is required" })}
                >
                  <option value="">-- Select active product node --</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>{p.name}</option>
                  ))}
                </Select>

                {selectedProduct && !selectedProduct.length_cm && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-soft/40 border border-amber/20 text-xs text-amber-dark">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <p>
                      <strong>Spatial Warning:</strong> This asset lacks physical dimensions. The system will fallback to a default (30x30x30cm) footprint, which severely impacts volumetric calculation accuracy.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Destination Facility"
                    required
                    disabled={loadingRents}
                    error={errors.warehouse_id?.message}
                    {...register("warehouse_id", { required: "Destination is required" })}
                  >
                    <option value="">-- Select leased warehouse --</option>
                    {rents.map((r) => (
                      <option key={r.warehouse_id} value={r.warehouse_id}>
                        {r.warehouse_location}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Injection Volume (Units)"
                    required
                    type="number"
                    min="1"
                    placeholder="100"
                    error={errors.quantity?.message}
                    {...register("quantity", {
                      required: "Volume is required",
                      min: { value: 1, message: "Must allocate ≥ 1" },
                    })}
                  />
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Live Diagnostics */}
        <div className="space-y-6">
          <Card className="bg-ink h-full flex flex-col justify-between text-paper border-none overflow-hidden sticky top-24 shadow-xl">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
              <Activity size={14} className="text-amber" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink">Spatial Diagnostics</h3>
            </div>
            
            <div className="p-5">
              {loadingWarehouseDetail ? (
                <p className="text-xs font-mono text-white/40 animate-pulse">Syncing facility data...</p>
              ) : !liveCalc ? (
                <p className="text-xs font-mono text-amber">Awaiting parameter input to compute spatial logistics.</p>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className={`flex items-center gap-2 pb-4 border-b ${liveCalc.overCapacity ? "border-red/30" : "border-white/10"}`}>
                    {liveCalc.overCapacity ? (
                      <AlertTriangle size={18} className="text-red shrink-0" />
                    ) : (
                      <CheckCircle2 size={18} className="text-teal shrink-0" />
                    )}
                    <p className={`text-sm font-semibold tracking-wide ${liveCalc.overCapacity ? "text-red" : "text-teal"}`}>
                      {liveCalc.overCapacity ? "CAPACITY EXCEEDED" : "PARAMETERS ACCEPTABLE"}
                    </p>
                  </div>

                  {liveCalc.mode === "space" ? (
                    <div className="text-xs text-white/70 space-y-3 font-mono">
                      <div className="flex justify-between">
                        <span className="text-green-800">Injection Footprint</span>
                        <span className="text-green-800">{liveCalc.additionalSqm.toFixed(2)} sqm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Current Usage</span>
                        <span className="text-green-800">{liveCalc.currentUsed.toFixed(2)} / {liveCalc.total.toFixed(2)} sqm</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                        <span className={liveCalc.overCapacity ? "text-red" : "text-green-800"}>Projected Balance</span>
                        <span className={liveCalc.overCapacity ? "text-red" : "text-teal"}>
                          {Math.abs(liveCalc.remaining).toFixed(2)} sqm {liveCalc.remaining >= 0 ? "Free" : "Deficit"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-white/70 space-y-3 font-mono">
                      <div className="flex justify-between">
                        <span className="text-white/40">Current Units</span>
                        <span className="text-white">{liveCalc.currentUsedQty} / {liveCalc.capacity}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                        <span className={liveCalc.overCapacity ? "text-red" : "text-white"}>Projected Balance</span>
                        <span className={liveCalc.overCapacity ? "text-red" : "text-teal"}>
                          {Math.abs(liveCalc.remaining)} {liveCalc.remaining >= 0 ? "Units Free" : "Unit Deficit"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Execution Button attached to diagnostic panel */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <Button
                type="submit"
                form="inventory-form"
                variant={liveCalc?.overCapacity ? "outline" : "primary"}
                className={`w-full ${!liveCalc?.overCapacity && 'bg-amber text-ink hover:bg-amber-dark border-none'}`}
                icon={Boxes}
                loading={mutation.isPending}
                disabled={liveCalc?.overCapacity || !liveCalc}
              >
                Commit Stock
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}