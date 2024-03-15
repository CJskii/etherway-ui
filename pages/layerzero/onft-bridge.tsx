import React from "react";
import { Typography } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/dashboard/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ONFTBridge() {

  const contractProvider = { type: "layerzero", contract: "ONFT" };

  // TODO: The idea here is that we're going to display FROM and TO network selection modals with search bar functionality to the user
  // We will only display the networks that are supported by the contract && in combination that is being supported by layerzero endpoints
  // ^^^ this is still something that I need to look into
  
  // The user will select FROM network and TO network, enter the NFT ID and click on the bridge button 
  // (if user is navigating directly from the minting page we want to pass minted NFT ID as a value to the URL and enter this for him)

  // If user is on the correct network we will call bridge function and send metamask popup
  // If user isn't connected to this network we will request network change
  // If user wallet isn't connected we will request to connect a wallet

  const handleBridgeButton = () => {
    console.log("Bridge button clicked");
  }

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <div className=" z-10 py-20 md:py-16 flex items-center justify-center min-h-[90vh]">
        <div className="bg-gradient my-auto md:rounded-xl md:w-7/12 lg:w-5/12 w-full items-start">
          <div className="p-8 md:p-14 md:px-16 flex flex-col gap-6">
            <Typography variant={"h3"} className=" dark:text-black text-center">
              Step 2 : Bridge ONFT
            </Typography>
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                Bridge From
              </Typography>
              <Select>
                <SelectTrigger className="bg-white p-6 dark:bg-white dark:text-black dark:border-0">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="polkadot">Polkadot</SelectItem>
                </SelectContent>
              </Select>
            </Label>
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                Bridge To
              </Typography>
              <Select>
                <SelectTrigger className="bg-white p-6 dark:bg-white dark:text-black dark:border-0">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="polkadot">Polkadot</SelectItem>
                </SelectContent>
              </Select>
            </Label>
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                NFT ID
              </Typography>
              <Input
                placeholder="ID"
                className="p-6 rounded-xl dark:bg-white dark:text-black"
              />
            </Label>

            <Button className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}>
              Bridge
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
