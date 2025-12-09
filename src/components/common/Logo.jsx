import React from 'react';
import { Package2 } from 'lucide-react';

const Logo = ({ className }) => {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {/* Icon Container */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 shadow-sm shadow-rose-500/20">
                <Package2 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            {/* Text */}
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
                BidStock<span className="text-rose-600">.</span>
            </span>
        </div>
    );
};

export default Logo;