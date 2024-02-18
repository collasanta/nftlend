import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, InputRightAddon, InputGroup } from "@chakra-ui/react";
import { abi } from '../../abi/NFTVault.json';
import erc721abi from '../../abi/ERC721.json';
import { EthereumTransactionParams, ethereumRequest, requestAccounts } from '@/lib/utils';

const NFTVaultContractAddress = '0x6B9e07c05B2B4f74C43dfDD7Bf09Efd14C700711';

const ContractInteraction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nftContractAddress, setNftContractAddress] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [principal, setPrincipal] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [interest, setInterest] = useState<string>('');

  const approveVaultHandler = async () => {
    const simpleNFTInterface = new ethers.utils.Interface(erc721abi);
    const functionData = simpleNFTInterface.encodeFunctionData('approve', [
      NFTVaultContractAddress,
      tokenId,
    ]);
    const [from] = await requestAccounts();
    ethereumRequest({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: nftContractAddress,
          value: '0x0',
          data: functionData,
        },
      ] as EthereumTransactionParams,
    });
  };

  const setLoanTerms = async () => {
    const Principal = ethers.utils.parseEther(principal ?? '0');
    const Interest = ethers.utils.parseEther(interest ?? '0');
    const NFTVaultInterface = new ethers.utils.Interface(abi);
    const functionData = NFTVaultInterface?.encodeFunctionData('setLoanTerms', [
      nftContractAddress,
      tokenId,
      Principal,
      duration,
      Interest,
    ]);
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
      <div className='mx-auto max-w-[750px] justify-center flex mt-10'>
        <Button onClick={onOpen} colorScheme='blue'>Create a Listing</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Set Loan Terms</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form id="depositToVault" onSubmit={setLoanTerms}>
                <FormControl>
                  <FormLabel>NFT Contract Address:</FormLabel>
                  <Input borderColor="gray.500" type="text" value={nftContractAddress} onChange={(e) => setNftContractAddress(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>NFT token ID:</FormLabel>
                  <Input borderColor="gray.500" type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                </FormControl>
                <Button colorScheme="blue" my={5} onClick={approveVaultHandler}>Approve Contract</Button>
                <FormControl>
                  <FormLabel>Duration</FormLabel>
                  <InputGroup>
                    <Input borderColor="gray.500" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    <InputRightAddon borderColor="gray.500" children="Seconds" />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Principal Amount</FormLabel>
                  <InputGroup>
                    <Input borderColor="gray.500" type="text" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                    <InputRightAddon borderColor="gray.500" children="ETH" />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Interest Amount</FormLabel>
                  <InputGroup>
                    <Input borderColor="gray.500" type="text" value={interest} onChange={(e) => setInterest(e.target.value)} />
                    <InputRightAddon borderColor="gray.500" children="ETH" />
                  </InputGroup>
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={setLoanTerms}>
                Submit
              </Button>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export { ContractInteraction };