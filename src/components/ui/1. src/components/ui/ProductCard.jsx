import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Star, TrendingUp, Package, Layers } from 'lucide-react';

const ProductCard = ({ product, onDelete, onEdit, onAddToInventory }) => {
  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  // Status Badge Colors
  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inactive: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    discontinued: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-100 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300"><Package size={40} /></div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-zinc-900 line-clamp-1">{product.name}</h3>
           <span className="font-bold text-rose-600">{formatPrice(product.price)}</span>
        </div>
        
        {/* New Action Button Area */}
        <div className="mt-auto pt-4 border-t border-zinc-100 flex gap-2">
            <button 
              onClick={() => onAddToInventory(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
            >
               <Layers size={14} /> Add Stock
            </button>
            <div className="flex gap-1">
               <button onClick={() => onEdit(product.product_id)} className="p-2 border rounded-lg hover:bg-zinc-50"><Edit2 size={16} className="text-zinc-500"/></button>
               <button onClick={() => onDelete(product.product_id)} className="p-2 border rounded-lg hover:bg-red-50"><Trash2 size={16} className="text-red-500"/></button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;