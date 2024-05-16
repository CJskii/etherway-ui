import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Typography } from "../ui/typography";
import { CardContent } from "../ui/card";
import { ChevronDown } from "lucide-react";

import { Network } from "@/common/types/network";
import Image from "next/image";
import { ChainData } from "@0xsquid/squid-types";

export interface NetworkModalProps {
  selectedNetwork: ChainData | undefined;
  onNetworkSelect: (network: ChainData) => void;
  filteredChains: ChainData[] | undefined;
  dialogTitle: string;
}
const SquidNetworkModal = ({ props }: { props: NetworkModalProps }) => {
  // DO WE WANT TO MANAGE ENTIRE LOGIC OF NETWORK SELECTIONS WITHIN THIS COMPONENT?
  // - We have to , as the input is taken in this component itself , we can just set the values back in the main component
  const { selectedNetwork, onNetworkSelect, filteredChains, dialogTitle } =
    props;

  const handleSelection = (network: ChainData) => {
    console.log(network.networkName);
    onNetworkSelect(network);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog>
      <DialogTrigger>
        {selectedNetwork && (
          <CardContent className="grid gap-4 px-0 pb-0 xl:w-44 lg:w-36 w-32 flex-1">
            <div className="flex items-center justify-center space-x-2 bg-primary rounded-md p-2 overflow-hidden">
              <Image
                src={selectedNetwork.chainIconURI as string}
                width={18}
                height={18}
                alt={selectedNetwork.networkName}
                className="rounded-full xl:w-[24px]"
              />
              <div className="flex-1 min-w-0 space-y-1 text-start">
                <Typography className="dark:text-black text-left font-semibold truncate xl:text-lg text-xs overflow-hidden text-overflow-ellipsis white-space-nowrap">
                  {capitalizeFirstLetter(selectedNetwork.networkName)}
                </Typography>
              </div>
              <ChevronDown size={12} className="text-black" />
            </div>
          </CardContent>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-xl bg-gradient p-6 border-0">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {/* <DialogDescription>{dialogDescription}</DialogDescription> */}
        </DialogHeader>
        <Command>
          <div></div>
          <CommandInput placeholder="Search for a network..." />
          <DialogClose>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup
                // heading={commandHeading}
                className="text-white text-left mt-4"
              >
                {filteredChains &&
                  filteredChains.map((network) => (
                    <CommandItem
                      key={network.networkName}
                      onSelect={() => handleSelection(network)}
                      className="flex items-center p-4 mb-1 rounded-md bg-white/30 cursor-pointer justify-start  gap-2 hover:opacity-80"
                    >
                      <Image
                        src={network.chainIconURI as string}
                        width={30}
                        height={30}
                        alt="network icon"
                        className="rounded-full"
                      />
                      <div className="flex flex-col text-lg">
                        <Typography
                          variant={"smallTitle"}
                          className="dark:text-black"
                        >
                          {capitalizeFirstLetter(network.networkName)}
                        </Typography>
                        <Typography
                          variant={"muted"}
                          className="dark:text-black/50 text-black/50 text-xs"
                        >
                          {network.nativeCurrency.symbol}
                        </Typography>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </DialogClose>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SquidNetworkModal;
