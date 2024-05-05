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

import { Network } from "@/common/types/network";
import Image from "next/image";

import { ChainData } from "@0xsquid/sdk";

export interface NetworkModalProps {
  selectedNetwork: ChainData | undefined;
  onNetworkSelect: (network: ChainData) => void;
  filteredChains: ChainData[] | undefined;
  dialogTitle: string;
  dialogDescription: string;
  commandHeading: string;
}
const SquidNetworkModal = ({ props }: { props: NetworkModalProps }) => {
  // DO WE WANT TO MANAGE ENTIRE LOGIC OF NETWORK SELECTIONS WITHIN THIS COMPONENT?
  // - We have to , as the input is taken in this component itself , we can just set the values back in the main component
  const {
    selectedNetwork,
    onNetworkSelect,
    filteredChains,
    dialogTitle,
    dialogDescription,
    commandHeading,
  } = props;

  const handleSelection = (network: ChainData) => {
    console.log(network.chainName);
    onNetworkSelect(network);
  };

  return (
    <Dialog>
      <DialogTrigger>
        {selectedNetwork && (
          <CardContent className="grid gap-4 px-0 pb-0 min-w-full">
            <div className="flex items-center space-x-4 bg-white/30 rounded-md border border-black p-4 overflow-hidden">
              <Image
                src={selectedNetwork.chainIconURI as string}
                width={40}
                height={40}
                alt={selectedNetwork.chainName}
              />
              <div className="flex-1 space-y-1 text-start">
                <Typography
                  variant={"smallTitle"}
                  className="dark:text-black font-semibold truncate"
                >
                  {selectedNetwork.chainName}
                </Typography>
                <p className="text-sm text-muted-foreground dark:text-black">
                  {selectedNetwork.nativeCurrency.symbol}
                </p>
              </div>
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
                      key={network.chainName}
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
                          {network.chainName}
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
};

export default SquidNetworkModal;
