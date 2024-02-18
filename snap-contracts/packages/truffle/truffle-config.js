/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation, and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "c8c18bb708574c728d95fb45ec034dfe";
const privateKey = "665d7ecabf6bdc350526825859c4e1876e877b137806fc41dec2b6351b1f529b";

module.exports = {
  contracts_build_directory: '../snap/packages/snap/src/contracts',
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
