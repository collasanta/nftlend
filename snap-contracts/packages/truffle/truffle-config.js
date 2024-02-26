require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = process.env.INFURAKEY
const privateKey = process.env.PRIVATEKEY

module.exports = {
  contracts_build_directory: '../snap/src/contracts',
  networks: {
    development: {
      host: "127.0.0.1",    
      port: 8545,           
      network_id: "1337",   
    },
    lineatestnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: `https://linea-goerli.infura.io/v3/${infuraKey}`
      }),
      network_id: 59140,      
      gas: 5500000,       
      confirmations: 2,    
      timeoutBlocks: 200,  
      skipDryRun: true     
    },
  },
  compilers: {
    solc: {
      version: '0.8.13',
    },
  }
};
