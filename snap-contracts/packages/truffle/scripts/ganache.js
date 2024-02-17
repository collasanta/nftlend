const ganache = require('ganache');
const { networks } = require('../truffle-config');

require('dotenv').config({});

if(process.env.MNEMONIC_PHRASE) { 
  options.wallet = { 
    mnemonic: process.env.MNEMONIC_PHRASE
  }; 
}
const server = ganache.server(
  {network_id: 1337}
);
const PORT = 8545;

server.listen(PORT, async (err) => {
  if (err) throw err;

  console.log(`ganache listening on port ${PORT}...`);
  console.log('accounts created');
  const provider = server.provider; 

  if(process.env.MNEMONIC_PHRASE) { 
    const accounts = await provider.request({
      method: 'eth_accounts',
      params: [],
    });
    console.log(accounts);
  } else { 
    console.log(`mnemonic used: ${provider.getOptions().wallet?.mnemonic}`);
    console.log(provider.getInitialAccounts());
  }
});
