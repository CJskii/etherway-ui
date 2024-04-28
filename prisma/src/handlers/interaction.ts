import { ContractType, InteractionType } from "prisma/prisma-client";
import { mintInteractionOFT, mintInteractionONFT } from "../create/newMint";
import handleUser from "./user";
import {
  bridgeInteractionOFT,
  bridgeInteractionONFT,
} from "../create/newBridge";
import { gasRefuel } from "../create/newGasRefuel";
import { claimV1Interaction } from "../create/newClaim";

type handleInteractionProps = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  amount?: number;
  chainId?: number;
};

export default async function handleInteraction({
  ethAddress,
  contractType,
  interactionType,
  chainId,
  amount,
}: handleInteractionProps) {
  await handleUser({ ethAddress });

  switch (interactionType) {
    case InteractionType.MINT_ONFT:
      return await mintInteractionONFT({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
      });
    case InteractionType.MINT_OFT:
      return await mintInteractionOFT({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
        amount,
      });
    case InteractionType.BRIDGE_ONFT:
      return await bridgeInteractionONFT({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
      });
    case InteractionType.BRIDGE_OFT:
      return await bridgeInteractionOFT({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
        amount,
      });
    case InteractionType.GAS_REFUEL:
      return await gasRefuel({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
        amount,
      });
    case InteractionType.V1:
      return await claimV1Interaction({
        ethAddress: ethAddress.toLowerCase(),
        contractType,
        interactionType,
        chainId,
        points: amount,
      });
    default:
      break;
  }
}
