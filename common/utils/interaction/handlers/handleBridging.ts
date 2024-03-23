import { ethers, Signer, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { Network } from "../../../types/network";
import handleInteraction from "./handleInteraction";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { updateBridgeData } from "../../api/bridge";
import { ContractType, InteractionType } from "@prisma/client";
import { updateInteractionData } from "../../api/interactions";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { abi } from "@/constants/contracts/abi/etherwayOFT";

export const handleBridging = async ({
  TOKEN_ID, // we use token-id as quantity for OFT
  fromNetwork,
  toNetwork,
  contractProvider,
  address,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  contractProvider: {
    type: string;
    contract: string;
  };
  address: string;
}) => {
  const txGasLimit = fromNetwork.params?.gasLimit.bridge;
  const signer = await getProviderOrSigner(true);
  const ownerAddress = await (signer as Signer).getAddress();

  if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "ONFT"
  ) {
    const { tx, error: bridgeError } = await handleLayerZeroONFTBridging({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      ownerAddress,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });

    if (tx.hash) {
      const { response, error: apiError } = await updateBridgeData({
        address: ownerAddress,
        contractType: ContractType.ONFT_ERC721,
        chainId: fromNetwork.id,
      });
      return { tx, response, bridgeError, apiError };
    }
    return { tx, bridgeError };
  } else if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "OFT"
  ) {
    const { tx, error: bridgeError } = await handleLayerZeroOFTBridging({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      ownerAddress,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });
    if (tx.hash) {
      const { response, error: apiError } = await updateInteractionData({
        address: ownerAddress,
        contractType: ContractType.OFT_ERC20,
        chainId: fromNetwork.id,
        interactionType: InteractionType.BRIDGE_OFT,
        amount: Number(TOKEN_ID),
      });
      return { tx, response, bridgeError, apiError };
    }
    return { tx, bridgeError };
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "ONFT"
  ) {
    const { tx, error: bridgeError } = await handleHyperlaneONFTBridging({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });

    // check the Tx with the tx Hash to confirm that it passed

    if (tx.hash) {
      const { response, error: APIerror } = await updateBridgeData({
        address: ownerAddress,
        contractType: ContractType.HONFT_ERC721,
        chainId: fromNetwork.id,
      });
      return { tx, response, bridgeError, APIerror };
    }
    return { tx, bridgeError };
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "OFT"
  ) {
    const { tx, error: bridgeError } = await handleHyperlaneOFTBridging({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      ownerAddress,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });
    if (tx.hash) {
      const { response, error: apiError } = await updateInteractionData({
        address: ownerAddress,
        contractType: ContractType.HOFT_ERC20,
        chainId: fromNetwork.id,
        interactionType: InteractionType.BRIDGE_OFT,
        amount: Number(TOKEN_ID),
      });
      return { tx, response, bridgeError, apiError };
    }
    return { tx, bridgeError };
  }
};

const handleLayerZeroONFTBridging = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  ownerAddress,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  ownerAddress: string;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  let tx;
  let error;

  if (!fromNetwork.deployedContracts)
    throw new Error(`No deployed contracts found for ${fromNetwork.name}`);

  const contract = new Contract(
    fromNetwork.deployedContracts.layerzero.ONFT.address,
    fromNetwork.deployedContracts.layerzero.ONFT.ABI,
    signer,
  );

  try {
    // REMOTE CHAIN ID IS THE CHAIN OF THE RECEIVING NETWORK
    // ex. if you are sending from Ethereum to Polygon, the remote chain id is the Polygon chain id
    const remoteChainId = toNetwork.params?.layerzero.remoteChainId;
    const lzOptionsGas = toNetwork.params?.gasLimit.lzOptionsGas;

    // create options
    const options = Options.newOptions()
      .addExecutorLzReceiveOption(lzOptionsGas || 200000, 0)
      .toHex()
      .toString();

    let nativeFee = 0;

    [nativeFee] = await contract.quote(
      remoteChainId,
      TOKEN_ID,
      ownerAddress,
      options,
      false,
    );
    tx = await contract.send(
      remoteChainId, // remote LayerZero chainId v2
      TOKEN_ID, // tokenId to send
      ownerAddress, // to address
      options, // flexible bytes array to indicate messaging adapter services
      false, // use LayerZero token as gas
      {
        value: nativeFee,
        gasLimit: txGasLimit,
      },
    );

    await tx.wait();
  } catch (e) {
    console.error(e);
    error = e;
    throw new Error((e as any).data?.message || (e as any)?.message);
  }

  return {
    tx,
    error,
  };
};

const handleLayerZeroOFTBridging = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  ownerAddress,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  ownerAddress: string;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  if (!fromNetwork.deployedContracts)
    throw new Error(`No deployed contracts found for ${fromNetwork.name}`);

  const contract = new Contract(
    fromNetwork.deployedContracts.layerzero.OFT.address,
    fromNetwork.deployedContracts.layerzero.OFT.ABI,
    signer,
  );

  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { address } = useAccount();

  let tx;
  let error;

  try {
    // REMOTE CHAIN ID IS THE CHAIN OF THE RECEIVING NETWORK
    // ex. if you are sending from Ethereum to Polygon, the remote chain id is the Polygon chain id
    const remoteChainId = toNetwork.params?.layerzero.remoteChainId;
    const lzOptionsGas = toNetwork.params?.gasLimit.lzOptionsGas;
    const tokensToSend = ethers.utils.parseEther(TOKEN_ID);
    const paddedAddress = ethers.utils.zeroPad(ownerAddress, 32);

    // create options
    const options = Options.newOptions()
      .addExecutorLzReceiveOption(lzOptionsGas || 200000, 0)
      .toHex()
      .toString();

    const sendParam = [
      remoteChainId,
      paddedAddress,
      tokensToSend,
      tokensToSend,
      options,
      "0x",
      "0x",
    ];

    let nativeFee = 0;

    const data = await publicClient?.readContract({
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      abi: abi,
      account: address,
      functionName: "quoteSend",
      args: [sendParam, false],
    });

    console.log(data);

    // [nativeFee] = await contract.quoteSend(sendParam, false);

    tx = await contract
      .send(sendParam, [nativeFee, 0], ownerAddress, {
        value: nativeFee,
        gasLimit: txGasLimit,
      })
      .then((tx: any) => tx.wait());

    console.log(` tx: ${tx.transactionHash}`);
  } catch (e) {
    console.error(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
  return {
    tx,
    error,
  };
};

const handleHyperlaneONFTBridging = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  let tx;
  let error;
  if (!fromNetwork.deployedContracts || !toNetwork.deployedContracts)
    throw new Error(
      `No deployed contracts found for ${fromNetwork.name} or ${toNetwork.name}`,
    );

  const contract = new Contract(
    fromNetwork.deployedContracts.hyperlane.ONFT.address,
    fromNetwork.deployedContracts.hyperlane.ONFT.ABI,
    signer,
  );

  const targetAddress = toNetwork.deployedContracts.hyperlane.ONFT.address;
  const targetChainId = toNetwork.params?.hyperlane.remoteChainId;

  try {
    const nativeFee = await contract.getBridgeGas(
      targetChainId,
      targetAddress,
      TOKEN_ID,
    );

    tx = await contract.sendPayload(targetChainId, targetAddress, TOKEN_ID, {
      value: nativeFee,
      gasLimit: txGasLimit,
    });

    await tx.wait();
  } catch (e) {
    error = e;
    throw new Error((e as any).data?.message || (e as any)?.message);
  }

  return {
    tx,
    error,
  };
};

const handleHyperlaneOFTBridging = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  ownerAddress,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  ownerAddress: string;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  let tx;
  let error;
  if (!fromNetwork.deployedContracts || !toNetwork.deployedContracts)
    throw new Error(
      `No deployed contracts found for ${fromNetwork.name} or ${toNetwork.name}`,
    );

  const contract = new Contract(
    fromNetwork.deployedContracts.hyperlane.OFT.address,
    fromNetwork.deployedContracts.hyperlane.OFT.ABI,
    signer,
  );

  const targetAddress = toNetwork.deployedContracts.hyperlane.OFT.address;
  const targetChainId = toNetwork.params?.hyperlane.remoteChainId;
  const amountInWei = ethers.utils.parseEther(TOKEN_ID);

  try {
    const [estimatedFee, totalCost] = await contract.getBridgeGas(
      targetChainId,
      targetAddress,
      amountInWei,
    );
    console.log(
      `Estimated fee: ${estimatedFee.toString()} | Total cost: ${totalCost.toString()}`,
    );

    tx = await contract.sendPayload(targetChainId, targetAddress, amountInWei, {
      value: totalCost,
      gasLimit: txGasLimit,
    });

    await tx.wait();
  } catch (e) {
    error = e;
    throw new Error((e as any).data?.message || (e as any)?.message);
  }

  return {
    tx,
    error,
  };
};
