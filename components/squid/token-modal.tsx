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
import { TokenData } from "@0xsquid/sdk";

interface TokenModalProps {
  filteredTokens: TokenData[];
  dialogTitle: string;
}

const SquidTokenModal = ({ props }: { props: TokenModalProps }) => {
  const { filteredTokens, dialogTitle } = props;

  // DO WE WANT TO MANAGE ENTIRE LOGIC OF TOKEN SELECTIONS WITHIN THIS COMPONENT?

  const handleSelection = (token: TokenData) => {
    console.log(token);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <CardContent className="grid gap-4 px-0 pb-0 min-w-full">
          <div className="flex items-center space-x-4 bg-white/30 rounded-md border border-black p-4 overflow-hidden">
            <div className="flex items-center gap-4">
              <Image
                src={filteredTokens[0].logoURI as string}
                width={30}
                height={30}
                alt="network icon"
                className="rounded-full"
              />
              <div className="flex flex-col text-lg">
                <Typography variant={"smallTitle"} className="dark:text-black">
                  {filteredTokens[0].name}
                </Typography>
              </div>
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
                {filteredTokens.map((token, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelection(token)}
                    className="flex items-center p-4 mb-1 rounded-md bg-white/30 cursor-pointer justify-start  gap-2 hover:opacity-80"
                  >
                    <Image
                      src={token.logoURI as string}
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
                        {token.name}
                      </Typography>
                      <Typography
                        variant={"smallTitle"}
                        className="dark:text-black"
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
