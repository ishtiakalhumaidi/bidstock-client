import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import { Input } from "../../ui/Field";
import Button from "../../ui/Button";
import { updateInventory } from "../../../api/inventory.api";

export default function EditInventoryModal({ inventory, open, onClose, queryKey }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      quantity: inventory?.quantity,
      min_stock_level: inventory?.min_stock_level ?? 10,
      max_stock_level: inventory?.max_stock_level ?? 1000,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => updateInventory(inventory.product_id, inventory.warehouse_id, payload),
    onSuccess: () => {
      toast.success("Inventory metrics updated");
      queryClient.invalidateQueries({ queryKey });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  if (!inventory) return null;

  return (
    <Modal open={open} onClose={onClose} title="Configure Inventory Limits">
      <div className="mb-4 p-3 bg-paper-dim rounded-lg border border-line">
        <p className="text-sm font-medium text-ink">{inventory.product_name}</p>
        <p className="text-xs text-ink-muted mt-1">Location: {inventory.warehouse_location}</p>
      </div>

      <form id="edit-inventory-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input 
          label="Current Quantity" 
          type="number" 
          required
          error={errors.quantity?.message}
          {...register("quantity", { required: "Required", min: 0 })} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Min Stock Alert Level" 
            type="number" 
            error={errors.min_stock_level?.message}
            {...register("min_stock_level", { min: 0 })} 
          />
          <Input 
            label="Max Stock Level" 
            type="number" 
            error={errors.max_stock_level?.message}
            {...register("max_stock_level", { min: 1 })} 
          />
        </div>
        <p className="text-xs text-ink-muted">Setting the quantity to or below the minimum stock level will trigger a system alert.</p>
      </form>
      
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" form="edit-inventory-form" variant="accent" loading={mutation.isPending}>
          Save configuration
        </Button>
      </div>
    </Modal>
  );
}