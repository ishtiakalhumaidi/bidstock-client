import { Link } from "react-router";
import { Gauge } from "lucide-react";

export default function Logo({ to = "/", size = "md" }) {
  const iconBox = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 14 : 18;
  const textSize = size === "sm" ? "text-base" : "text-xl";

  return (
    <Link to={to} className="inline-flex items-center gap-2 group">
      <span className={`${iconBox} rounded-lg bg-ink flex items-center justify-center transition-transform duration-200 group-hover:rotate-[-6deg]`}>
        <Gauge size={iconSize} className="text-amber" />
      </span>
      <span className={`font-display font-semibold ${textSize} tracking-tight text-ink`}>
        BidStock
      </span>
    </Link>
  );
}