import { GasPriceProps } from "../../types/gas-refuel";
import { Typography } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaRegQuestionCircle } from "react-icons/fa";

const GasPriceDisplay: React.FC<GasPriceProps> = ({
  label,
  amount,
  currencySymbol,
  usdValue,
  tooltipDescription,
}) => {
  return (
    <div className="flex justify-between gap-4">
      <Typography
        variant={"smallTitle"}
        className="text-left dark:text-black flex justify-center items-center gap-2"
      >
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaRegQuestionCircle />
            </TooltipTrigger>
            <TooltipContent className="bg-gradient border-0">
              <Typography variant={"smallTitle"} className="dark:text-black">
                {tooltipDescription}
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Typography>

      <Typography variant="smallTitle" className="text-right dark:text-black">
        {amount} {currencySymbol}
        {usdValue && (
          <span className="opacity-70"> {`($${usdValue} USD)`}</span>
        )}
      </Typography>
    </div>
  );
};

export default GasPriceDisplay;
