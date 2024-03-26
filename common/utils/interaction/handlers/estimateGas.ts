import { handleErrors } from "./handleErrors";
import { ethers, Signer, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { estimateGasParams } from "../../../types/gas-refuel";
import { Network } from "../../../types/network";
import { Options } from "@layerzerolabs/lz-v2-utilities";

export const estimateGasRequest = async ({
  fromNetwork,
  toNetwork,
  inputAmount,
  setIsLoading,
  setGasFee,
  setErrorMessage,
  setShowGasModal,
  recipientAddress,
}: estimateGasParams) => {
  setIsLoading(true);
  try {
    const estimatedFee = await estimateGasBridgeFee({
      fromNetwork,
      targetNetwork: toNetwork,
      value: inputAmount,
      recipientAddress,
    });

    setGasFee(estimatedFee.toString());
    setIsLoading(false);
  } catch (e) {
    console.error(e);
    handleErrors({ e, setErrorMessage });
    setShowGasModal(true);
    setIsLoading(false);
  }
};

const estimateGasBridgeFee = async ({
  fromNetwork,
  targetNetwork,
  value,
  recipientAddress = "",
}: {
  fromNetwork: Network;
  targetNetwork: Network;
  value: string;
  recipientAddress?: string;
}) => {
  const signer = (await getProviderOrSigner(true)) as Signer;
  const ownerAddress = await signer.getAddress();
  const refundAddress = recipientAddress || ownerAddress;

  if (!fromNetwork.deployedContracts)
    throw new Error(`No deployed contracts found for ${fromNetwork.name}`);
  const contract = new Contract(
    fromNetwork.deployedContracts.layerzero.OFT.address,
    fromNetwork.deployedContracts.layerzero.OFT.ABI,
    signer,
  );
  const paddedAddress = ethers.utils.zeroPad(refundAddress, 32);
  const tokensToSend = ethers.utils.parseUnits(value, "ether");
  const options = Options.newOptions()
    .addExecutorNativeDropOption(
      tokensToSend.toString(),
      paddedAddress.toString(),
    )
    .addExecutorLzReceiveOption(200000, 0)
    .toHex()
    .toString();

  const sendParam = [
    targetNetwork.params?.layerzero?.remoteChainId,
    paddedAddress,
    0,
    0,
    options,
    "0x",
    "0x",
  ];

  try {
    let nativeFee = 0;
    [nativeFee] = await contract.quoteSend(sendParam, false);

    return nativeFee;
  } catch (error) {
    console.error(`Error estimating gas fee: ${(error as any).message}`);
    throw error; // Propagate the error to handle it in the UI layer
  }
};
