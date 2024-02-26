import { heading, panel, text } from '@metamask/snaps-ui';
import type { Json } from '@metamask/utils';
import { ethers } from 'ethers';

import NFTVault from './contracts/NFTVault.json';

/**
 * Get insights for a transaction.
 *
 * @param transaction - The transaction object.
 * @param transactionOrigin - The origin of the transaction.
 * @returns The insights for the transaction.
 */
export async function getInsights(
  transaction: { [key: string]: Json },
  transactionOrigin: string,
) {
  const networkId = await ethereum.request({ method: 'net_version' });

  if (typeof networkId !== 'string') {
    throw new Error('networkId not found');
  }

  const NFTVaultContractAddress = NFTVault.networks[
    networkId as keyof typeof NFTVault.networks
  ]
    ? NFTVault.networks[networkId as keyof typeof NFTVault.networks].address
    : null;

  const verifiedStatus =
    NFTVaultContractAddress?.toLowerCase() === transaction.to
      ? 'Verified Protocol Contract ✅'
      : '⚠️ Contract not recognized as NTFLend Protocol Contract ⚠️';

  if (verifiedStatus === 'Verified Protocol Contract ✅') {
    const NFTVaultInterface = new ethers.Interface(NFTVault.abi);
    const parsedTransaction = NFTVaultInterface.parseTransaction({
      data: String(transaction.data),
    });

    const transactionValue = transaction.value?.toString() ?? '0x0';
    const transactionValueWei = BigInt(transactionValue).toString();

    if (parsedTransaction?.name === 'setLoanTerms') {
      return {
        content: panel([
          heading(`${verifiedStatus}`),
          text('NFT Vault Contract from NTFLend Protocol'),
          text('Requested from website:'),
          text(`${transactionOrigin}`),
          text(`Chain id:${networkId}`),
          text('Function:'),
          heading(`📜 ${parsedTransaction.name}`),
          heading('NFT Contract Address:'),
          text(`${String(parsedTransaction.args[0])}`),
          heading('NFT TokenId:'),
          text(`${String(parsedTransaction.args[1])}`),
          heading('Loan Principal:'),
          text(`${String(parsedTransaction.args[2])} wei`),
          heading('Duration:'),
          text(`${String(parsedTransaction.args[3])} seconds`),
          heading('Interest Amount:'),
          text(`${String(parsedTransaction.args[4])} wei`),
        ]),
      };
    }

    if (parsedTransaction?.name === 'lend') {
      return {
        content: panel([
          heading(`${verifiedStatus}`),
          text('NFT Vault Contract from NTFLend Protocol'),
          text('Requested from website:'),
          text(`${transactionOrigin}`),
          text(`Chain id:${networkId}`),
          text('Function:'),
          heading(`📜 ${parsedTransaction.name}`),
          heading(`Loan ID:`),
          text(`${String(parsedTransaction.args[0])}`),
          heading(`Sending:`),
          text(`${transactionValueWei} wei`),
          text(`as Loan Principal`),
        ]),
      };
    }

    if (parsedTransaction?.name === 'repay') {
      return {
        content: panel([
          heading(`${verifiedStatus}`),
          text('NFT Vault Contract from NTFLend Protocol'),
          text('Requested from website:'),
          text(`${transactionOrigin}`),
          text(`Chain id:${networkId}`),
          text('Function:'),
          heading(`📜 ${parsedTransaction.name}`),
          heading(`Loan ID:`),
          text(`${String(parsedTransaction.args)}`),
          heading(`Sending:`),
          text(`${transactionValueWei} wei`),
          text(`as Loan Principal + Interest Amount`),
        ]),
      };
    }

    if (parsedTransaction?.name === 'defaultCollateral') {
      return {
        content: panel([
          heading(`${verifiedStatus}`),
          text('NFT Vault Contract from NTFLend Protocol'),
          text('Requested from website:'),
          text(`${transactionOrigin}`),
          text('Chain id:'),
          text(`Chain id:${networkId}`),
          text('Function:'),
          heading(`📜 ${parsedTransaction.name}`),
          heading(`Loan ID:`),
          text(`${String(parsedTransaction.args)}`),
        ]),
      };
    }
  }

  return {
    content: panel([
      heading(`${verifiedStatus}`),
      text(`Requested from website: ${transactionOrigin}`),
      text(`Chain id:${networkId}`),
    ]),
  };
}
