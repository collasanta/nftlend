import { ethers } from "ethers";

export type TransactionParams = {
  from: string;
  to?: string;
  value?: string;
  data?: string;
  msg?: string;
} ;

export type EthereumTransactionParams = TransactionParams[] | [string, string] | object; 

export const requestAccounts = async (): Promise<string[]> => {
  const accounts = await ethereumRequest({ method: 'eth_requestAccounts' });
  return accounts as string[];
};

export const ethereumRequest = async (request: { method: string; params?: EthereumTransactionParams }) => {
  if (window.ethereum) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return await window.ethereum.request(request);
    } catch (error) {
      console.error(error);
      window.alert('Failed to make Ethereum request');
      return null;
    }
  } else {
    console.error('Ethereum object not found');
    window.alert('Please Install Metamask');
  }
};

export const calculateAPR = (principal: string, interest: string, duration: string) => {
  const principalInEther = ethers.utils.formatEther(principal);
  const interestInEther = ethers.utils.formatEther(interest);
  const durationInYears = Number(duration) / (60 * 60 * 24 * 365); // Convert seconds to years

  const APR = ((Number(interestInEther) / Number(principalInEther)) / durationInYears * 100).toFixed(5); // Calculate APR

  return APR;
}

export enum LoanStatus {
  Available = '0',
  Active = '1',
  Defaulted = '2',
  Repaid = '3'
}