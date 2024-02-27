import { useState } from "react"
import { ILoan } from "./Listing";
import { ethers } from 'ethers';
import { abi } from '../../abi/NFTVault.json';
import { EthereumTransactionParams, LoanStatus, calculateAPR, convertSeconds, ethereumRequest, requestAccounts } from "@/lib/utils";

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
      <div className="flex flex-col mx-auto border max-w-[600px] bg-slate-200 border-black/5 text-card-foreground shadow-sm rounded-lg text-[13px]  py-2 px-2 hover:shadow-lg transition">
        <div className="flex flex-col pt-6 sm:pt-0 sm:flex-row items-center justify-around">
          <div className="flex flex-col items-center gap-x-2 truncate">
            <div onClick={handleClick} className="cursor-pointer w-fit bg-card py-1 rounded-md mx-auto text-center flex flex-col justify-center items-center">
              <img src={listing.imgURL} width={112} height={64} alt="thumbnail" className="rounded-md" />
              <span className="text-zinc-500 p-1 rounded-lg bg-slate-200">{listing.name}</span>
            </div>
          </div>
          <div onClick={handleClick} className="cursor-pointer">
            <div className="pb-2">
              <div className="flex flex-col items-center">
              </div>
            </div>
            <div className="grid grid-cols-2 text-start bg-card p-2 rounded-lg max-w-[250px] min-w-[200px]" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="flex flex-col justify-start items-start">
                <p className="text-[10px] pr-2 text-sm text-center whitespace-break-spaces">Chain:</p>
                <p className="text-[10px] pr-2 text-sm text-center whitespace-break-spaces">Principal:</p>
                <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">Yield:</p>
                <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">Duration:</p>
                <p className="text-[10px] text-sm pr-2 whitespace-break-spaces">APR:</p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <p className="text-[10px] pr-2 text-sm text-center whitespace-break-spaces">
                  <span className="text-gray-500">{listing.chain}</span>
                </p>
                <p className="text-[10px] pr-2 text-sm text-center whitespace-break-spaces">
                  <span className="text-gray-500">{ethers.utils.formatEther(listing.principal).toString()} eth</span>
                </p>
                <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">
                  <span className="text-gray-500">{ethers.utils.formatEther(listing.interest).toString()} eth</span>
                </p>
                <p className="text-[10px] text-sm pr-2 text-center whitespace-break-spaces">
                  <span className="text-gray-500">{convertSeconds(listing.duration)}</span>
                </p>
                <p className="text-[10px] text-sm pr-2 whitespace-break-spaces">
                  <span className="text-gray-500">{calculateAPR(listing.principal, listing.interest, listing.duration)}%</span>
                </p>
              </div>
            </div>
          </div>
          <div className="text-centerounded-lg flex justify-center items-center rounded-lg flex-col py-2 min-w-[100px] sm:h-[100px]">
            <p className="font-semibold text-sm pr-2 text-center whitespace-break-spaces bg-card p-2 min-w-[100px] rounded-lg">
              <span className="text-[15px]">
                {listing.loanStatus === LoanStatus.Available && '🟢'}
                {listing.loanStatus === LoanStatus.Active && '🟡'}
                {listing.loanStatus === LoanStatus.Defaulted && '🔴'}
                {listing.loanStatus === LoanStatus.Repaid && '🔵'}
              </span>
              <span className="text-[13px] text-gray-600 ml-2">
                {listing.loanStatus === LoanStatus.Available && 'Available'}
                {(listing.loanStatus === LoanStatus.Active && timeLeft !== 0) && 'Active'}
                {(listing.loanStatus === LoanStatus.Active && timeLeft === 0) && 'Expired'}
                {listing.loanStatus === LoanStatus.Defaulted && 'Defaulted'}
                {listing.loanStatus === LoanStatus.Repaid && 'Repaid'}
              </span>
            </p>
            {
              listing.loanStatus === LoanStatus.Available && (
                <button onClick={lendMoney} className="z-[0] mt-3 p-2 min-w-[100px] text-[14px] bg-green-600 shadow-sm text-white rounded-lg" >
                  Lend
                </button>
              )
            }
            {
              (listing.loanStatus === LoanStatus.Active && timeLeft !== 0) && (
                <div className="mx-auto items-center flex flex-col">
                  <button onClick={repayLoan} className="mt-3 p-2 min-w-[100px] text-[14px] bg-blue-400 shadow-sm text-white rounded-lg" >
                    Repay
                  </button>
                </div>

              )
            }
            {
              (listing.loanStatus === LoanStatus.Active && timeLeft === 0) && (
                <div className="mx-auto items-center flex flex-col">
                  <button onClick={defaultCollateral} className="mt-3 p-2 min-w-[100px] text-white text-[14px] bg-red-400 shadow-sm rounded-lg" >
                    Default
                  </button>
                </div>

              )
            }
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

              </div>
            )}
          </div>
        }
      </div>
    </>
  )
}

