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

import { CardContent } from "./ui/card";

import { ExtendedNetwork } from "@/common/types/network";
import Image from "next/image";

interface NetworkModalProps {
  props: {
    selectedNetwork: ExtendedNetwork;
    onNetworkSelect: (network: ExtendedNetwork) => void;
    filteredChains: ExtendedNetwork[];
    dialogTitle: string;
    dialogDescription: string;
    commandHeading: string;
  };
}

const NetworkModal = ({ props }: NetworkModalProps) => {
  const {
    selectedNetwork,
    onNetworkSelect,
    filteredChains,
    dialogTitle,
    dialogDescription,
    commandHeading,
  } = props;

  const handleSelection = (network: ExtendedNetwork) => {
    onNetworkSelect(network);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <CardContent className="grid gap-4 px-0">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Image
              src={selectedNetwork.iconUrl as string}
              width={40}
              height={40}
              alt={selectedNetwork.name}
            />
            <div className="flex-1 space-y-1 text-start">
              <p className="text-lg font-medium leading-none">
                {selectedNetwork.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedNetwork.nativeCurrency.symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Type a network name or search..." />
          <DialogClose>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup
                heading={commandHeading}
                className="text-white text-left"
              >
                {filteredChains.map((network) => (
                  <CommandItem
                    key={network.name}
                    onSelect={() => handleSelection(network)}
                    className="flex justify-start items-center gap-2 hover:opacity-80 border-x-[1px] border-transparent hover:border-x-gray-500 cursor-pointer"
                  >
                    <Image
                      src={network.iconUrl as string}
                      width={30}
                      height={30}
                      alt="network icon"
                    />
                    <div className="flex flex-col text-lg">
                      <span className="text-neutral-content">
                        {network.name}
                      </span>
                      <span className="text-neutral text-sm">
                        {network.nativeCurrency.symbol}
                      </span>
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

export default NetworkModal;
