import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2 className={cn("mx-auto h-24 w-24 animate-spin", className)} />
  );
};

export default Loader;
