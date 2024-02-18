import { useState } from "react"
import { ILoan } from "./Listing";
import { Button } from "@chakra-ui/react";
import { ethers } from 'ethers';
import { abi } from '../../abi/NFTVault.json';
import { EthereumTransactionParams, LoanStatus, calculateAPR, ethereumRequest, requestAccounts } from "@/lib/utils";

const NFTVaultContractAddress = '0x6B9e07c05B2B4f74C43dfDD7Bf09Efd14C700711';
const NFTVaultInterface = new ethers.utils.Interface(abi);

export const ListingCard = (
  { listing, collapsed = false }: { listing: ILoan, collapsed?: boolean }
) => {
  const [isOpen, setIsOpen] = useState(collapsed);
  const timeLeft = Number(listing.duration) - (Math.floor(Date.now() / 1000) - Number(listing.startDate)) > 0 ? Number(listing.duration) - (Math.floor(Date.now() / 1000) - Number(listing.startDate)) : 0

  function handleClick() {
    setIsOpen(!isOpen);
  }

  const lendMoney = async (): Promise<void> => {
    const loanId = listing.loanId
    const functionData = NFTVaultInterface!.encodeFunctionData('lend', [
      loanId,
    ]);
    const [from] = await requestAccounts();
    ethereumRequest({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: NFTVaultContractAddress,
          value: `0x${Number(listing.principal).toString(16)}`,
          data: functionData,
        },
      ] as EthereumTransactionParams,
    });
  };

  const repayLoan = async (): Promise<void> => {
    const loanId = listing.loanId
    const loanPrincipalPlusInterest = Number(listing.principal) + Number(listing.interest)
    const functionData = NFTVaultInterface!.encodeFunctionData('repay', [
      loanId,
    ]);
    const [from] = await requestAccounts();
    ethereumRequest({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: NFTVaultContractAddress,
          value: `0x${Number(loanPrincipalPlusInterest).toString(16)}`,
          data: functionData,
        },
      ] as EthereumTransactionParams,
    });
  };


  const defaultCollateral = async (): Promise<void> => {
    const loanId = listing.loanId
    const functionData = NFTVaultInterface!.encodeFunctionData(
      'defaultCollateral',
      [loanId],
    );
    const [from] = await requestAccounts();
    ethereumRequest({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: NFTVaultContractAddress,
          value: '0x0',
          data: functionData,
        },
      ] as EthereumTransactionParams,
    });
  };

  return (
    <>
      <div className="flex flex-col mx-auto border max-w-[600px] shadow-md bg-slate-200 border-black/5 text-card-foreground shadow-sm rounded-lg text-[13px]  py-2 px-2 hover:shadow-lg transition cursor-pointer">
        <div onClick={handleClick} className="flex items-center justify-between ">
          <div>
            <div className="flex items-center">
              <span className="text-[25px]">
                {listing.loanStatus === LoanStatus.Available && '🟢'}
                {listing.loanStatus === LoanStatus.Active && '🟡'}
                {listing.loanStatus === LoanStatus.Defaulted && '🔴'}
                {listing.loanStatus === LoanStatus.Repaid && '🔵'}
              </span>
              <span className="text-[10px] text-gray-500 ml-2">
                {listing.loanStatus === LoanStatus.Available && 'Available'}
                {listing.loanStatus === LoanStatus.Active && '   Active'}
                {listing.loanStatus === LoanStatus.Defaulted && 'Defaulted'}
                {listing.loanStatus === LoanStatus.Repaid && '   Repaid'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-800 ml-2">
              Time Left:
            </p>
            <p className="text-[10px] font-bold text-gray-800 ml-2">
              <span className="max-w-[50px] font-normal overflow-hidden overflow-ellipsis align-bottom inline-block whitespace-nowrap">{timeLeft}</span> <span className="font-normal">sec</span>
            </p>
          </div>

          <div className="flex items-center gap-x-2 truncate">

            <div className="w-fit rounded-md mx-auto text-center flex flex-col justify-center items-center">
              <img src={listing.imgURL} width={112} height={64} alt="thumbnail" className="rounded-md" />
            </div>
          </div>
          <div className="text-start flex flex-col justify-start items-start bg-card p-2 rounded-lg">
            <p className="font-semibold text-sm pr-2 text-center whitespace-break-spaces">
              {listing.name} <span className="text-gray-500 text-xs">{listing.chain}</span>
            </p>
            <p className="text-[10px] pr-2 text-center whitespace-break-spaces">

            </p>
            <p className="text-[10px] pr-2 text-sm text-center whitespace-break-spaces">
              Principal: <span className="text-gray-500">{listing.principal} wei</span>
            </p>
            <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">
              Interest:   <span className="text-gray-500">{listing.interest} wei</span>
            </p>
            <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">
              Duration: <span className="text-gray-500">{listing.duration} sec</span>
            </p>
            <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">
              APR: <span className="text-gray-500">{calculateAPR(listing.principal, listing.interest, listing.duration)}%</span>
            </p>
          </div>
        </div>
        {isOpen &&
          <div>
            {isOpen && (
              <div className="bg-card flex flex-row justify-around rounded-lg mt-4 ">
                <div className="text-centerounded-lg py-4">
                  <p className="text-[10px] min-w-[300px] font-bold pr-2 text-center whitespace-break-spaces">
                    NFT Contract Address:
                  </p>
                  <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
                    {listing.nftContractAddress}
                  </p>
                  <p className="text-[10px] font-bold pr-2 text-center whitespace-break-spaces">
                    TokenId:
                    <span className="font-normal">{listing.tokenId}</span>
                  </p>
                  <p className="text-[10px] font-bold pr-2 text-center whitespace-break-spaces">
                    Owner:
                  </p>
                  <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
                    {listing.initialOwner}
                  </p>
                  {
                    (listing.loanStatus !== LoanStatus.Available) && (
                      <>
                        <p className="text-[10px] font-bold pr-2 text-center whitespace-break-spaces">
                          Lender:
                        </p>
                        <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
                          {listing.lender}
                        </p>
                        <p className="text-[10px] font-bold pr-2 text-center whitespace-break-spaces">
                          Start Date:
                        </p>
                        <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
                          {new Date(Number(listing.startDate) * 1000).toUTCString()}
                        </p>
                        <p className="text-[10px] font-bold pr-2 text-center whitespace-break-spaces">
                          Time Left: {timeLeft} sec
                        </p>
                      </>

                    )
                  }
                </div>
                <div className="text-centerounded-lg flex justify-center items-center flex-col py-2">
                  {
                    listing.loanStatus === LoanStatus.Available && (
                      <Button onClick={lendMoney} colorScheme="green">
                        Lend
                      </Button>
                    )
                  }
                  {
                    listing.loanStatus === LoanStatus.Active && (
                      <div className="mx-auto items-center flex flex-col">
                        <Button onClick={repayLoan} className="mt-3" colorScheme="green">
                          Repay
                        </Button>
                      </div>

                    )
                  }
                  {
                    (listing.loanStatus === LoanStatus.Active && timeLeft === 0) && (
                      <div className="mx-auto items-center flex flex-col">
                        <Button onClick={defaultCollateral} className="mt-3" colorScheme="red">
                          Default
                        </Button>
                      </div>

                    )
                  }
                </div>
              </div>
            )}
          </div>
        }
      </div>
    </>
  )
}

