import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/src/lib/utils";
import { Typography } from "./typography";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  className?: string;
  value: number; // Percentage of progress
  currentLevel: number; // Current level of the user
  currentXP: number; // Current XP of the user
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, currentLevel, currentXP, ...props }, ref) => (
  <div className="p-2 pb-8">
    <div className="flex justify-between mb-1">
      <Typography
        variant="lead"
        className="text-muted-foreground dark:text-white"
      >
        0%
      </Typography>
      <Typography
        variant="large"
        className="text-muted-foreground dark:text-white"
      >
        Level {currentLevel} ({currentXP} XP)
      </Typography>

      <Typography
        variant="lead"
        className="text-muted-foreground dark:text-white"
      >
        {" "}
        100%
      </Typography>
    </div>

    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-[#b5b4b6]/30 shadow-sm",
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-gradient transition-all"
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
