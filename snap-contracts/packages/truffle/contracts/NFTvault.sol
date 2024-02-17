// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "truffle/console.sol";

contract NFTVault is ReentrancyGuard, IERC721Receiver {
  using SafeMath for uint256;

  constructor() {
    owner = payable(msg.sender);  // Set the contract deployer as the owner
  }

  uint256 public feePercentage = 1;  // 1% fee
  address payable public owner;
  uint256 public totalFeesCollected;

  enum LoanStatus { Available, Active, Defaulted, Repaid }
  struct Loan {
    address initialOwner;
    address nftContractAddress;
    uint256 tokenId;
    uint256 principal;
    uint256 duration;
    uint256 interest;
    address lender;
    uint256 startDate;
    LoanStatus status;
  }

  uint256 public loanId = 0;
  mapping(uint256 => Loan) public loans;

  // Define events
  event LoanTermsSet(uint256 loanId, address indexed initialOwner, address indexed nftContractAddress, uint256 indexed tokenId, uint256 principal, uint256 duration, uint256 interest);
  event LoanLended(uint256 loanId, address indexed lender, uint256 startDate);
  event DefaultCollateral(uint256 loanId, address indexed initialOwner);
  event LoanRepaid(uint256 loanId, address indexed lender, uint256 repaymentAmount,uint256 proportionalInteresPaid, uint256 timePassed, uint256 refundExcessAmount);

  function setLoanTerms(address nftAddress, uint256 tokenId, uint256 principal, uint256 duration, uint256 interest) public {
    IERC721 nftContract = IERC721(nftAddress);
    
    // Check if the caller is the owner of the NFT
    require(nftContract.ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT");

    // Check if the owner has given permission for the contract to manage this specific NFT
    require(nftContract.getApproved(tokenId) == address(this), "Contract is not approved to manage this NFT");

    ++loanId;
    // Store the loan details with a new loan ID
    loans[loanId] = Loan(msg.sender, nftAddress, tokenId, principal, duration, interest, address(0), 0, LoanStatus.Available);

    // Emit event
    emit LoanTermsSet(loanId, msg.sender, nftAddress, tokenId, principal, duration, interest);
  }

  function lend(uint256 _loanId) public payable nonReentrant {
    IERC721 nftContract = IERC721(loans[_loanId].nftContractAddress);
    Loan storage loan = loans[_loanId];
    
    require(loan.initialOwner != msg.sender, "You cant lend to yourself");

    // Check if the loan is available
    require(loan.status == LoanStatus.Available, "Loan is not available");

    // Check if the initial owner still owns the NFT
    require(nftContract.ownerOf(loan.tokenId) == loan.initialOwner, "Initial owner no longer owns the NFT");

    // Check if the contract is still approved to transfer the NFT
    require(nftContract.getApproved(loan.tokenId) == address(this), "Contract is not approved to transfer this NFT");

    // Check if the amount of ETH sent is equal to the loan principal
    require(msg.value == loan.principal, "Sent amount is not equal to the principal amount");

    // Transfer the NFT from the initial owner to the contract
    nftContract.safeTransferFrom(loan.initialOwner, address(this), loan.tokenId);

    // Transfer the ETH to the initial owner of the loan
    payable(loan.initialOwner).transfer(msg.value);

    // Set the lender and start date of the loan
    loan.lender = msg.sender;
    loan.startDate = block.timestamp;
    loan.status = LoanStatus.Active;

    // Emit event
    emit LoanLended(_loanId, msg.sender, loan.startDate);
  }

  function defaultCollateral(uint256 _loanId) public {
    IERC721 nftContract = IERC721(loans[_loanId].nftContractAddress);
    Loan storage loan = loans[_loanId];

    require(loan.status == LoanStatus.Active, "Loan is not active");
    // Check if the caller is the lender of the loan
    require(msg.sender == loan.lender, "Caller is not the lender");

    // Check if the loan duration has passed
    require(block.timestamp >= loan.startDate.add(loan.duration), "Loan duration has not passed");

    // Transfer the NFT from the contract to the lender
    nftContract.safeTransferFrom(address(this), loan.lender, loan.tokenId);

    loan.status = LoanStatus.Defaulted;

    // Emit event
    emit DefaultCollateral(_loanId, msg.sender);
  }

  function repay(uint256 _loanId) public payable nonReentrant {
    Loan storage loan = loans[_loanId];
    IERC721 nftContract = IERC721(loans[_loanId].nftContractAddress);

    // Check if the caller is the initial owner of the NFT
    require(msg.sender == loan.initialOwner, "Caller is not the initial owner");

    // Check if the repayment date is within the loan duration
    require(block.timestamp <= loan.startDate.add(loan.duration), "Repayment date has passed");

    // Calculate the proportion of the loan duration that has passed
    uint256 timePassed = block.timestamp.sub(loan.startDate);
    // Multiply by 1e18 to keep precision
    uint256 durationProportion = timePassed.mul(1e18).div(loan.duration);
    // Calculate the proportional interest
    uint256 proportionalInterestPaid = loan.interest.mul(durationProportion).div(1e18);
    // Calculate the total repayment amount
    uint256 repaymentAmount = loan.principal.add(proportionalInterestPaid);
    // Check if value sent is enough to repay the loan
    require(msg.value >= repaymentAmount, "Insufficient repayment amount");


    uint256 refundExcessAmount = msg.value.sub(repaymentAmount);

    // If the amount of ETH sent is more than the repayment amount, refund the excess
    if (refundExcessAmount > 0) {
      payable(msg.sender).transfer(refundExcessAmount);
    }

    // Transfer the NFT from the contract back to the initial owner
    nftContract.safeTransferFrom(address(this), loan.initialOwner, loan.tokenId);

    // Subtract the protocol fee from the repayment amount
    uint256 fee = repaymentAmount.mul(feePercentage).div(100);  // Calculate the fee

    totalFeesCollected = totalFeesCollected.add(fee);  // Add the fee to the total fees collected
    uint256 repaymentAmounMinusFee = repaymentAmount.sub(fee);

    // Transfer the ETH to the lender
    payable(loan.lender).transfer(repaymentAmounMinusFee);

    loan.status = LoanStatus.Repaid;
    
    // Emit event
    emit LoanRepaid(_loanId, msg.sender, repaymentAmounMinusFee, proportionalInterestPaid, timePassed, refundExcessAmount);
  }

  function withdrawFees() public nonReentrant {
    require(msg.sender == owner, "Only the owner can withdraw fees");

    uint256 fees = totalFeesCollected;
    totalFeesCollected = 0;  // Reset the collected fees

    owner.transfer(fees);  // Transfer the fees to the owner
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}
