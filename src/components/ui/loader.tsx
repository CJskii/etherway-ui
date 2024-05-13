import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2
      className={cn(
        "mx-auto h-24 w-24 animate-spin text-secondary/60",
        className,
      )}
    />
  );
};

export default Loader;
