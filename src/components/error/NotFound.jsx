import { Link, useRouteError } from "react-router";
import { Compass } from "lucide-react";
import Button from "../ui/Button";

export default function NotFound() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="h-14 w-14 rounded-full bg-paper-dim border border-line flex items-center justify-center mb-6 shadow-sm animate-in zoom-in duration-300">
        <Compass size={24} className="text-ink-muted" />
      </div>
      
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
        {error?.status ? `System Error ${error.status}` : "Error 404"}
      </p>
      
      <h1 className="font-display font-semibold text-3xl text-ink mb-3 tracking-tight">
        Route Unavailable
      </h1>
      
      <p className="text-sm text-ink-soft max-w-sm mx-auto mb-8 leading-relaxed">
        {error?.statusText || error?.message || "The module you are looking for does not exist, was moved, or requires higher authorization clearance."}
      </p>
      
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to Floor
        </Button>
      </Link>
    </div>
  );
}