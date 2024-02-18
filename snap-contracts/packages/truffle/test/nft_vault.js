const NFTVault = artifacts.require("NFTVault");
const ERC721Mock = artifacts.require("ERC721Mock"); // You need to have a mock ERC721 contract for testing

contract("NFTVault", accounts => {
  let nftVault;
  let erc721Mock;
  const owner = accounts[1];
  const lender = accounts[2];
  const tokenId = 1;
  const principal = web3.utils.toWei("1", "ether");
  const duration = 60 * 60 * 24 * 7; // 1 week in seconds
  const interest = web3.utils.toWei("0.1", "ether"); 

  beforeEach(async () => {
    erc721Mock = await ERC721Mock.new();
    nftVault = await NFTVault.new();
    await erc721Mock.mint(owner, tokenId);
    await erc721Mock.approve(nftVault.address, tokenId, { from: owner });
  });

  it("should set loan terms", async () => {
    await nftVault.setLoanTerms(erc721Mock.address, tokenId, principal, duration, interest, { from: owner });
    const loan = await nftVault.loans(1);
    assert.equal(loan.initialOwner, owner);
    assert.equal(loan.nftContractAddress, erc721Mock.address);
    assert.equal(loan.tokenId.toString(), tokenId.toString());
    assert.equal(loan.principal.toString(), principal.toString());
    assert.equal(loan.duration.toString(), duration.toString());
    assert.equal(loan.interest.toString(), interest.toString());
    assert.equal(loan.status.toString(), "0"); // Available
  });

  it("should lend", async () => {
    await nftVault.setLoanTerms(erc721Mock.address, tokenId, principal, duration, interest, { from: owner });
    await nftVault.lend(1, { from: lender, value: principal });
    const loan = await nftVault.loans(1);
    assert.equal(loan.lender, lender);
    assert.equal(loan.status.toString(), "1"); // Active
  });

  it("should default collateral", async () => {
    await nftVault.setLoanTerms(erc721Mock.address, tokenId, principal, duration, interest, { from: owner });
    await nftVault.lend(1, { from: lender, value: principal });
    await increaseTime(duration + 1);
    await nftVault.defaultCollateral(1, { from: lender });
    const loan = await nftVault.loans(1);
    assert.equal(loan.status.toString(), "2"); // Defaulted
  });

  it("should repay", async () => {
    await nftVault.setLoanTerms(erc721Mock.address, tokenId, principal, duration, interest, { from: owner });
    await nftVault.lend(1, { from: lender, value: principal });
    const repaymentAmount = web3.utils.toWei("1.1", "ether")
    await increaseTime(60 * 60 * 24 * 1);
    await nftVault.repay(1, { from: owner, value: repaymentAmount });
    const loan = await nftVault.loans(1);
    assert.equal(loan.status.toString(), "3"); // Repaid
  });
});

function increaseTime(time) {
  return new Promise(async (resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time],
      id: new Date().getTime(),
    }, err1 => {
      if (err1) return reject(err1);
      web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}