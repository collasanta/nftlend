import type { BytesLike } from 'ethers';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import NFTVault from '../../../snap/src/contracts/NFTVault.json';
import SimpleNFT from '../../../snap/src/contracts/SimpleNFT.json';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

type Loan = {
  initialOwner: string;
  nftContractAddress: string;
  tokenId: number;
  principal: number;
  duration: number;
  interest: number;
  lender: string;
  startDate: number;
  status: number;
};

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [networkId, setNetworkId] = useState<unknown>();
  const [loan, setLoan] = useState<Loan>();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setNetworkId(await window.ethereum.request({ method: 'net_version' }));
      } catch (error) {
        console.error('Failed to fetch network version:', error);
      }
    };
    const handleChainChanged = () => {
      run().catch((error) =>
        console.error('Failed to handle chain change:', error),
      );
    };
    window.ethereum.on('chainChanged', handleChainChanged);
    run().catch((error) =>
      console.error('Failed to run initial chain fetch:', error),
    );
  }, []);

  const simpleNFTContractAddress =
    (networkId &&
      SimpleNFT.networks[networkId as keyof typeof SimpleNFT.networks]
        ?.address) ||
    null;
  const simpleNFTInterface = new ethers.Interface(SimpleNFT.abi);
  const NFTVaultContractAddress =
    (networkId &&
      NFTVault.networks[networkId as keyof typeof NFTVault.networks]
        ?.address) ||
    null;
  const NFTVaultInterface = NFTVaultContractAddress
    ? new ethers.Interface(NFTVault.abi)
    : null;

  const mintNFTHandler = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const tokenID = String(data.get('mintNFTtokenID'));
    const functionData = simpleNFTInterface.encodeFunctionData('mint', [
      tokenID,
    ]);
    // Get the user's account from MetaMask.
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: simpleNFTContractAddress,
            value: '0x0',
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const approveVaultHandler = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const address = String(data.get('contractAddressToApprove'));
    const tokenId = String(data.get('tokenIdToApprove'));
    const functionData = simpleNFTInterface.encodeFunctionData('approve', [
      NFTVaultContractAddress,
      tokenId,
    ]);
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: address,
            value: '0x0',
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const setLoanTerms = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const nftAddress = `${String(data.get('nftContractAddress')) ?? ''}`;
    const tokenId = String(data.get('tokenId'));
    const principal = ethers.parseEther(String(data.get('principal') ?? '0'));
    const duration = parseInt(String(data.get('duration')) ?? '0', 10);
    const interest = ethers.parseEther(String(data.get('interest') ?? ''));
    const functionData = NFTVaultInterface?.encodeFunctionData('setLoanTerms', [
      nftAddress,
      tokenId,
      principal,
      duration,
      interest,
    ]);
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: NFTVaultContractAddress,
            value: '0x0',
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const lendMoney = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const loanId = parseInt(data.get('loanId')?.toString() ?? '0', 10);
    const loanPrincipal = ethers.parseEther(
      data.get('loanPrincipal')?.toString() ?? '',
    );
    const functionData = NFTVaultInterface?.encodeFunctionData('lend', [
      loanId,
    ]);
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: NFTVaultContractAddress,
            value: `0x${Number(loanPrincipal).toString(16)}`,
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const repayLoan = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const loanId = parseInt(data.get('loanId')?.toString() ?? '0', 10);
    const loanPrincipalPlusInterest = ethers.parseEther(
      data.get('loanPrincipalPlusInterest')?.toString() ?? '',
    );
    const functionData = NFTVaultInterface?.encodeFunctionData('repay', [
      loanId,
    ]);
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: NFTVaultContractAddress,
            value: `0x${Number(loanPrincipalPlusInterest).toString(16)}`,
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const defaultCollateral = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const loanId = parseInt(data.get('loanId')?.toString() ?? '0', 10);
    const functionData = NFTVaultInterface?.encodeFunctionData(
      'defaultCollateral',
      [loanId],
    );
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Send a transaction to MetaMask.
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: NFTVaultContractAddress,
            value: '0x0',
            data: functionData,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getLoanInfo = async (eve: React.FormEvent<HTMLFormElement>) => {
    eve.preventDefault();
    const data = new FormData(eve.target as HTMLFormElement);
    const loanId = parseInt(String(data.get('loanId')) ?? '0', 10);
    const functionData = NFTVaultInterface?.encodeFunctionData('loans', [
      loanId,
    ]);
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      // Call the contract.
      const Loan = await window.ethereum.request({
        method: 'eth_call',
        params: [
          {
            from,
            to: NFTVaultContractAddress,
            data: functionData,
          },
          'latest',
        ],
      });
      const decodedLoan = NFTVaultInterface?.decodeFunctionResult(
        'loans',
        Loan as BytesLike,
      );
      const loanObject = {
        initialOwner: decodedLoan?.[0] ?? '',
        nftContractAddress: decodedLoan?.[1] ?? '',
        tokenId: decodedLoan?.[2] ?? '',
        principal: decodedLoan?.[3] ?? '',
        duration: decodedLoan?.[4] ?? '',
        interest: decodedLoan?.[5] ?? '',
        lender: decodedLoan?.[6] ?? '',
        startDate: decodedLoan?.[7] ?? '',
        status: decodedLoan?.[8] ?? '',
      };
      setLoan(loanObject);
      return decodedLoan;
    } catch (error) {
      return null;
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        {simpleNFTContractAddress && (
          <Card
            content={{
              title: 'Mint an NFT',
              description: (
                <form
                  id="mintNFT"
                  onSubmit={
                    mintNFTHandler as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <label>TokenID:</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="mintNFTtokenID"
                      id="mintNFTtokenID"
                    />
                  </p>
                  <button type="submit">Mint</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Approve the NFT Vault to hold your NFT',
              description: (
                <form
                  id="approveVault"
                  onSubmit={
                    approveVaultHandler as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <label>NFT Contract Address:</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="contractAddressToApprove"
                      id="contractAddressToApprove"
                      value={simpleNFTContractAddress?.toString() || ''}
                    />
                  </p>
                  <p>
                    <label>NFT token ID:</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="tokenIdToApprove"
                      id="tokenIdToApprove"
                    />
                  </p>
                  <button type="submit">Approve</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Set the Loan Terms',
              description: (
                <form
                  id="depositToVault"
                  onSubmit={
                    setLoanTerms as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <em>
                      Borrower should call this function to set the loan terms
                    </em>
                  </p>
                  <p>
                    <label>NFT Contract Address:</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="nftContractAddress"
                      id="nftContractAddress"
                      value={simpleNFTContractAddress?.toString() || ''}
                    />
                  </p>
                  <p>
                    <label>NFT token ID:</label>
                  </p>
                  <p>
                    <input type="text" name="tokenId" id="tokenId" />
                  </p>
                  <p>
                    <label>Principal Amount</label>
                  </p>
                  <p>
                    <input type="text" name="principal" id="principal" />
                  </p>
                  <p>
                    <label>Duration</label>
                  </p>
                  <p>
                    <input type="text" name="duration" id="duration" />
                  </p>
                  <p>
                    <label>Interest Amount</label>
                  </p>
                  <p>
                    <input type="text" name="interest" id="interest" />
                  </p>
                  <button type="submit">Deposit</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Get Loan Info',
              description: (
                <form
                  id="getLoanInfo"
                  onSubmit={
                    getLoanInfo as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <label>loanId:</label>
                  </p>
                  <p>
                    <input type="text" name="loanId" id="loanId" />
                  </p>
                  <button type="submit">Get Loan Info</button>
                  {loan && (
                    <div>
                      <p>
                        <b>Initial Owner:</b>{' '}
                        <span style={{ color: 'gray', fontSize: '0.6em' }}>
                          {loan.initialOwner}
                        </span>
                      </p>
                      <p>
                        <b>NFT Contract Address:</b>{' '}
                        <span style={{ color: 'gray', fontSize: '0.6em' }}>
                          {loan.nftContractAddress}
                        </span>
                      </p>
                      <p>
                        <b>Token ID:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.tokenId.toString()}
                        </span>
                      </p>
                      <p>
                        <b>Principal:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.principal.toString()}
                        </span>
                      </p>
                      <p>
                        <b>Duration:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.duration.toString()}
                        </span>
                      </p>
                      <p>
                        <b>Interest:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.interest.toString()}
                        </span>
                      </p>
                      <p>
                        <b>Lender:</b>{' '}
                        <span style={{ color: 'gray', fontSize: '0.6em' }}>
                          {loan.lender}
                        </span>
                      </p>
                      <p>
                        <b>Start Date:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.startDate.toString()}
                        </span>
                      </p>
                      <p>
                        <b>Status:</b>{' '}
                        <span style={{ color: 'gray' }}>
                          {loan.status.toString() === '0' && 'Available'}
                          {loan.status.toString() === '1' && 'Active'}
                          {loan.status.toString() === '2' && 'Defaulted'}
                          {loan.status.toString() === '3' && 'Repaid'}
                        </span>
                      </p>
                    </div>
                  )}
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Lend',
              description: (
                <form
                  id="lend"
                  onSubmit={
                    lendMoney as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <em>
                      Lender should call this function to lend money to the
                      borrower
                    </em>
                  </p>
                  <p>
                    <label>LoanId:</label>
                  </p>
                  <p>
                    <input type="text" name="loanId" id="loanId" />
                  </p>
                  <p>
                    <label>Loan Principal Amount</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="loanPrincipal"
                      id="loanPrincipal"
                    />
                  </p>
                  <button type="submit">Lend</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Repay Loan',
              description: (
                <form
                  id="repay"
                  onSubmit={
                    repayLoan as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <em>
                      Borrower should call this function to repay the loan
                    </em>
                  </p>
                  <p>
                    <label>LoanId:</label>
                  </p>
                  <p>
                    <input type="text" name="loanId" id="loanId" />
                  </p>
                  <p>
                    <label>Principal Amount + Interest</label>
                  </p>
                  <p>
                    <input
                      type="text"
                      name="loanPrincipalPlusInterest"
                      id="loanPrincipalPlusInterest"
                    />
                  </p>

                  <button type="submit">Repay</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}

        {NFTVaultContractAddress && (
          <Card
            content={{
              title: 'Default Collateral',
              description: (
                <form
                  id="withdraw"
                  onSubmit={
                    defaultCollateral as React.FormEventHandler<HTMLFormElement>
                  }
                >
                  <p>
                    <em>
                      Make sure Loan is in default and you are calling this from
                      the second wallet
                    </em>
                  </p>
                  <p>
                    <label>LoanId:</label>
                  </p>
                  <p>
                    <input type="text" name="loanId" id="loanId" />
                  </p>
                  <button type="submit">Withdraw NFT</button>
                </form>
              ),
            }}
            disabled={false}
            fullWidth={false}
          />
        )}
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
