import { Injectable } from '@nestjs/common';
import { ethers, Interface } from 'ethers';
import { abi } from '../abi/NFTVault.json';

const nftVaultAddress = '0x6B9e07c05B2B4f74C43dfDD7Bf09Efd14C700711';
const nftVaultInterface = new Interface(abi);
const infuraKey = 'c8c18bb708574c728d95fb45ec034dfe';

export interface MetadataResult {
  contractAddress: string;
  chain: string;
  tokenId: number;
  metadata: Metadata | null;
  imgURL: string | null;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  background_color: string;
  customImage: string;
  customAnimationUrl: string;
}

export interface Loan {
  loanId: number;
  initialOwner: string;
  nftContractAddress: string;
  tokenId: number;
  principal: string;
  duration: string;
  interest: string;
  lender: string;
  startDate: string;
  loanStatus: string;
  chain: string;
  imgURL: string;
  name: string;
}

@Injectable()
export class UsersService {
  private provider(): ethers.JsonRpcProvider {
    const provider = new ethers.JsonRpcProvider(
      `https://linea-goerli.infura.io/v3/${infuraKey}`,
    );
    return provider;
  }

  async getMetadata(
    contractAddress: string,
    tokenId: number,
  ): Promise<MetadataResult> {
    const abi = [
      'function tokenURI(uint256 _tokenId) external view returns (string)',
    ];
    const provider = this.provider();
    const chain = await provider.getNetwork();
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const tokenURI = await contract.tokenURI(tokenId);
    // Handle the case where the tokenURI is not found
    if (tokenURI === '' || tokenURI === null) {
      return {
        contractAddress,
        chain: chain.name,
        tokenId: tokenId,
        metadata: {
          name: 'MOCKNFT',
          description: '',
          image: '',
          external_url: '',
          background_color: '',
          customImage: '',
          customAnimationUrl: '',
        },
        imgURL:
          'https://st2.depositphotos.com/3904951/8925/v/450/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg',
      };
    }
    const ipfsURL = tokenURI.replace('ipfs://', 'https://cf-ipfs.com/ipfs/');
    try {
      const response = await fetch(ipfsURL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch metadata from ${tokenURI}: ${response.status} ${response.statusText}`,
        );
      } else {
        const metadata = await response.json();
        if (!metadata || typeof metadata.name !== 'string') {
          throw new Error('Invalid metadata');
        }
        return {
          contractAddress,
          chain: chain.name,
          tokenId: tokenId,
          metadata,
          imgURL: metadata.image.replace(
            'ipfs://',
            'https://cf-ipfs.com/ipfs/',
          ),
        };
      }
    } catch (error) {
      console.error(`Failed to get NFT Metadata: ${error}`);
      throw error;
    }
  }

  async getLoans(): Promise<Loan[]> {
    try {
      const listings = [];
      let index = 1;
      let result;
      do {
        result = await this.getLoan(index);
        const convertedResult = result[0];
        if (convertedResult === '0x0000000000000000000000000000000000000000') {
          break;
        }
        listings.push(result);
        index++;
      } while (true);
      const listingsMetadata = await Promise.all(
        listings.map(async (listing, index) => {
          const metadata = await this.getMetadata(listing[1], listing[2]);
          return {
            loanId: index + 1,
            initialOwner: listing[0],
            nftContractAddress: listing[1],
            tokenId: listing[2],
            principal: listing[3],
            duration: listing[4],
            interest: listing[5],
            lender: listing[6],
            startDate: listing[7],
            loanStatus: listing[8],
            chain: metadata.chain,
            imgURL: metadata.imgURL,
            name: metadata.metadata.name,
          };
        }),
      );
      return listingsMetadata;
    } catch (error) {
      console.error(`Failed to get loans: ${error}`);
      throw error;
    }
  }

  async getLoan(index: number): Promise<string[]> {
    try {
      const provider = this.provider();
      const contract = new ethers.Contract(
        nftVaultAddress,
        nftVaultInterface,
        provider,
      );
      const result = await contract.loans(index);
      const convertedResult = result.map((value) =>
        typeof value === 'bigint' ? value.toString() : value,
      );
      return convertedResult;
    } catch (error) {
      console.error(`Failed to get loan at index ${index}: ${error}`);
      throw error;
    }
  }
}
