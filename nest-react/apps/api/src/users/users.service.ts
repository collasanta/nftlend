import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
const abi = [
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function totalSupply() external view returns (uint256)',
];

@Injectable()
export class UsersService {
  private provider(): ethers.JsonRpcProvider {
    const provider = new ethers.JsonRpcProvider(
      'https://linea-goerli.infura.io/v3/c8c18bb708574c728d95fb45ec034dfe',
    );
    return provider;
  }

  async findNfts(contractAddress: string) {
    const provider = this.provider();
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const totalSupply = await contract.totalSupply();
    const nfts = [];
    for (let i = 1; i <= totalSupply; i++) {
      const tokenURI = await contract.tokenURI(i-1);
      const ipfsURL = tokenURI.replace('ipfs://', 'https://cf-ipfs.com/ipfs/');
      const response = await fetch(ipfsURL);
      if (!response.ok) {
        console.error(
          `Failed to fetch metadata from ${tokenURI}: ${response.status} ${response.statusText}`,
        );
      } else {
        const metadata = await response.json();
        nfts.push({ tokenId: i, metadata });
      }
    }
    return nfts
  }
}
