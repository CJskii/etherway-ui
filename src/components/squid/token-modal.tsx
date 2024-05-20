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
import Image from "next/image";
import { Token } from "@0xsquid/squid-types";
import { ChevronDown } from "lucide-react";
import { TokenBalance } from "@0xsquid/sdk/dist/types";
import {
  rawTokenBalance,
  formatToFixedDecimals,
} from "@/src/utils/squid/bridgeUtils";

export interface TokenModalProps {
  selectedToken: Token | undefined;
  onTokenSelect: (token: Token) => void;
  filteredTokens: Token[] | undefined;
  dialogTitle: string;
}

const SquidTokenModal = ({
  props,
  balanceData,
}: {
  props: TokenModalProps;
  balanceData?: TokenBalance[] | undefined;
}) => {
  const { selectedToken, onTokenSelect, filteredTokens, dialogTitle } = props;

  // DO WE WANT TO MANAGE ENTIRE LOGIC OF TOKEN SELECTIONS WITHIN THIS COMPONENT?

  const handleSelection = (token: Token) => {
    console.log(token);
    onTokenSelect(token);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const balance = (token: Token) => {
    if (!selectedToken || !balanceData) return "0.00";
    return rawTokenBalance({ balanceData, tokenProps: token });
  };

  return (
    <Dialog>
      <DialogTrigger>
        {selectedToken && (
          <CardContent className="grid gap-4 px-0 pb-0 xl:w-44 lg:w-36 w-32">
            <div className="flex items-center justify-center space-x-2 bg-primary rounded-md  p-2 overflow-hidden">
              <Image
                src={selectedToken.logoURI as string}
                width={18}
                height={18}
                alt="network icon"
                className="rounded-full xl:w-[24px]"
              />
              <div className="flex-1 min-w-0">
                <Typography className="dark:text-black text-left font-semibold truncate xl:text-lg text-xs overflow-hidden text-overflow-ellipsis white-space-nowrap">
                  {selectedToken.name}
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
          <CommandInput placeholder="Search for a network..." />
          <DialogClose>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup
                // heading={commandHeading}
                className="text-white text-left mt-4 "
              >
                {filteredTokens &&
                  filteredTokens.map((token, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelection(token)}
                      className="flex items-center p-4 mb-1 rounded-md bg-white/30 cursor-pointer justify-start overflow-hidden gap-2 hover:opacity-80"
                    >
                      <Image
                        src={token.logoURI as string}
                        width={30}
                        height={30}
                        alt="network icon"
                        className="rounded-full"
                      />
                      <div className="flex flex-col text-lg">
                        <div className="flex justify-start items-center gap-2">
                          <Typography
                            variant={"smallTitle"}
                            className="dark:text-black"
                          >
                            {token.name}
                          </Typography>
                          {balanceData && (
                            <Typography
                              variant={"muted"}
                              className="dark:text-black/50 text-xs"
                            >
                              [ {Number(balance(token))} {""}
                              {token.symbol} ]
                            </Typography>
                          )}
                        </div>

                        <Typography
                          variant={"muted"}
                          className="dark:text-black/50 text-black/50 text-xs truncate md:hidden"
                        >
                          {formatAddress(token.address)}
                        </Typography>
                        <Typography
                          variant={"muted"}
                          className="dark:text-black/50 text-black/50 text-xs 
                           hidden md:block"
                        >
                          {token.address}
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

export default SquidTokenModal;
