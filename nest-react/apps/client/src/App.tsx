import { QueryClient, QueryClientProvider } from 'react-query';
import { Header } from './components/Header'
import { Listing } from './components/Listing'
import { ContractInteraction } from './components/ContractInteraction';
import { ChakraProvider } from '@chakra-ui/react';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <ContractInteraction />
          <Listing />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  )
}

export default App
