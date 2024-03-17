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

import { Typography } from "./ui/typography";

import { CardContent } from "./ui/card";

import { ExtendedNetwork } from "@/common/types/network";
import Image from "next/image";
import { Input } from "./ui/input";

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
        <CardContent className="grid gap-4 px-0 pb-0 min-w-full">
          <div className="flex items-center space-x-4 bg-white/30 rounded-md border border-black p-4 overflow-hidden">
            <Image
              src={selectedNetwork.iconUrl as string}
              width={40}
              height={40}
              alt={selectedNetwork.name}
            />
            <div className="flex-1 space-y-1 text-start">
              <Typography
                variant={"smallTitle"}
                className="dark:text-black font-semibold truncate"
              >
                {selectedNetwork.name}
              </Typography>
              <p className="text-sm text-muted-foreground dark:text-black">
                {selectedNetwork.nativeCurrency.symbol}
              </p>
            </div>
          </div>
        </CardContent>
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
                {filteredChains.map((network) => (
                  <CommandItem
                    key={network.name}
                    onSelect={() => handleSelection(network)}
                    className="flex items-center p-4 mb-1 rounded-md bg-white/30 cursor-pointer justify-start  gap-2 hover:opacity-80"
                  >
                    <Image
                      src={network.iconUrl as string}
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
                        {network.name}
                      </Typography>
                      <Typography
                        variant={"extraSmall"}
                        className="dark:text-black text-muted-foreground"
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

  return (
    <Dialog>
      <DialogTrigger>
        <CardContent className="grid gap-4 px-0 pb-0 min-w-full">
          <div className="flex items-center space-x-4 rounded-md border border-black p-4 overflow-hidden">
            <Image
              src={selectedNetwork.iconUrl as string}
              width={40}
              height={40}
              alt={selectedNetwork.name}
            />
            <div className="flex-1 space-y-1 text-start">
              <Typography
                variant={"smallTitle"}
                className="dark:text-black font-semibold truncate"
              >
                {selectedNetwork.name}
              </Typography>
              <p className="text-sm text-muted-foreground">
                {selectedNetwork.nativeCurrency.symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </DialogTrigger>
      <DialogContent className="rounded-xl bg-gradient-to-b from-red-200 via-pink-300 to-purple-500 p-6">
        {/* <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Select Mint Network
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-200">
            Ensure your wallet is connected to the selected network.
          </DialogDescription>
        </DialogHeader> */}
        <Input
          placeholder="Search for a network..."
          className="p-6 rounded-xl dark:bg-white dark:text-black"
        />
        <ul className="divide-y divide-gray-300 overflow-auto gap-2">
          {filteredChains.map((network) => (
            <li
              key={network.name}
              className="flex items-center p-4 rounded-md hover:bg-white/30 cursor-pointer"
              onClick={() => handleSelection(network)}
            >
              <img
                src={network.iconUrl as string}
                width={30}
                height={30}
                alt={network.name}
                className="rounded-full" // Ensures the icons are rounded
              />
              <div className="flex flex-col ml-4">
                <span className="font-semibold text-white">{network.name}</span>
                <span className="text-sm text-gray-200">
                  {network.nativeCurrency.symbol}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkModal;
