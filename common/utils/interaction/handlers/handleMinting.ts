import { ethers, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { Network } from "../../../types/network";
import { getTokenId } from "../../getters/getTokenId";
import { Signer } from "ethers";
import { updateMintData } from "../../api/mintAPI";
import { ContractType, InteractionType } from "@prisma/client";
import { updateInteractionData } from "../../api/interactions";

export const handleMinting = async ({
  mintNetwork,
  contractProvider,
  mintQuantity,
  userAddress,
}: {
  mintNetwork: Network;
  contractProvider: {
    type: string;
    contract: string;
  };
  mintQuantity?: number;
  userAddress: `0x${string}`;
}) => {
  const mintGasLimit = mintNetwork.params?.gasLimit.mint || 500000;

  if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "ONFT"
  ) {
    const result = await handleLayerZeroONFTMinting({
      mintNetwork,
      mintGasLimit,
    });

    if (result && result.txHash) {
      const { response, error: apiError } = await updateMintData({
        address: userAddress,
        contractType: ContractType.ONFT_ERC721,
        chainId: mintNetwork.id,
      });
      return { result, response, apiError };
    }

    return { result };
  } else if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "OFT"
  ) {
    const result = await handleLayerZeroOFTMinting({
      mintNetwork,
      mintGasLimit,
      mintQuantity: mintQuantity || 0,
    });

    if (result && result.txHash) {
      const { response, error: apiError } = await updateInteractionData({
        address: userAddress,
        contractType: ContractType.OFT_ERC20,
        chainId: mintNetwork.id,
        interactionType: InteractionType.MINT_OFT,
        amount: mintQuantity,
      });
      return { result, response, apiError };
    }

    return { result };
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "ONFT"
  ) {
    const result = await handleHyperlaneONFTMinting({
      mintNetwork,
      mintGasLimit,
    });

    if (result && result.txHash) {
      const { response, error: apiError } = await updateMintData({
        address: userAddress,
        contractType: ContractType.HONFT_ERC721,
        chainId: mintNetwork.id,
      });
      return { result, response, apiError };
    }

    return { result };
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "OFT"
  ) {
    const result = await handleHyperlaneOFTMinting({
      mintNetwork,
      mintGasLimit,
      mintQuantity: mintQuantity || 0,
    });

    if (result && result.txHash) {
      const { response, error: apiError } = await updateInteractionData({
        address: userAddress,
        contractType: ContractType.HOFT_ERC20,
        chainId: mintNetwork.id,
        interactionType: InteractionType.MINT_OFT,
        amount: mintQuantity,
      });
      return { result, response, apiError };
    }

    return { result };
  }
};

const handleLayerZeroONFTMinting = async ({
  mintNetwork,
  mintGasLimit,
}: {
  mintNetwork: Network;
  mintGasLimit: number | string;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.layerzero.ONFT.address,
      mintNetwork.deployedContracts.layerzero.ONFT.ABI,
      signer as any,
    );
    const contractFeeInWei = await contract.mintFee();
    const feeInEther = ethers.utils.formatEther(contractFeeInWei);

    let tx = await (
      await contract.mint({
        value: ethers.utils.parseEther(feeInEther),
        gasLimit: mintGasLimit,
      })
    ).wait();

    const txHash: string = tx.transactionHash;
    let mintedID = await getTokenId({ txHash, mintNetwork, provider });

    return { mintedID, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleHyperlaneONFTMinting = async ({
  mintNetwork,
  mintGasLimit,
}: {
  mintNetwork: Network;
  mintGasLimit: number | string;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.hyperlane.ONFT.address,
      mintNetwork.deployedContracts.hyperlane.ONFT.ABI,
      signer as any,
    );
    const fee = await contract.fee();

    let tx = await (
      await contract.mint({
        value: fee,
        gasLimit: mintGasLimit,
      })
    ).wait();

    const txHash: string = tx.transactionHash;
    let mintedID = await getTokenId({ txHash, mintNetwork, provider });

    return { mintedID, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleLayerZeroOFTMinting = async ({
  mintNetwork,
  mintGasLimit,
  mintQuantity,
}: {
  mintNetwork: Network;
  mintGasLimit: number | string;
  mintQuantity: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);
    const toAddress = (await (signer as Signer).getAddress()).toLowerCase();

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.layerzero.OFT.address,
      mintNetwork.deployedContracts.layerzero.OFT.ABI,
      signer as any,
    );
    const fee = await contract.getMintFee(mintQuantity);

    console.log(`Minting ${mintQuantity} OFTs...`);

    const tx = await contract.mint(toAddress, mintQuantity, {
      value: fee,
      gasLimit: mintGasLimit,
    });

    await tx.wait();

    const txHash: string = tx.hash;

    return { mintedID: 0, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleHyperlaneOFTMinting = async ({
  mintNetwork,
  mintGasLimit,
  mintQuantity,
}: {
  mintNetwork: Network;
  mintGasLimit: number | string;
  mintQuantity: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);
    const toAddress = (await (signer as Signer).getAddress()).toLowerCase();

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.hyperlane.OFT.address,
      mintNetwork.deployedContracts.hyperlane.OFT.ABI,
      signer as any,
    );

    const contractFee = await contract.fee();
    const totalFee = contractFee.mul(mintQuantity);

    console.log(`Minting ${mintQuantity} OFTs...`);

    const tx = await contract.mint(toAddress, mintQuantity, {
      value: totalFee,
      gasLimit: mintGasLimit,
    });

    await tx.wait();

    const txHash: string = tx.hash;

    return { mintedID: 0, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};
