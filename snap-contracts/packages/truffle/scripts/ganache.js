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

  console.log("Deploying Contracts")
  const { exec } = require('child_process');
  exec('truffle migrate', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
