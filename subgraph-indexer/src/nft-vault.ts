import {
  DefaultCollateral as DefaultCollateralEvent,
  LoanLended as LoanLendedEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent
} from "../generated/NFTVault/NFTVault"
import {
  DefaultCollateral,
  LoanLended,
  LoanRepaid,
  LoanTermsSet,
  LoanStruct
} from "../generated/schema"


export function handleDefaultCollateral(event: DefaultCollateralEvent): void {
  let entity = new DefaultCollateral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.loanId = event.params.loanId
  entity.initialOwner = event.params.initialOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let loan = LoanStruct.load(event.params.loanId.toString())
  if (loan) {
    loan.status = LoanStatus.Defaulted
    loan.save()
  }
}

export function handleLoanLended(event: LoanLendedEvent): void {
  let entity = new LoanLended(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.loanId = event.params.loanId
  entity.lender = event.params.lender
  entity.startDate = event.params.startDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let loan = LoanStruct.load(event.params.loanId.toString())
  if (loan) {
    loan.status = LoanStatus.Active
    loan.lender = event.params.lender
    loan.startDate = event.params.startDate
    loan.save()
  }


}

export function handleLoanRepaid(event: LoanRepaidEvent): void {
  let entity = new LoanRepaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.loanId = event.params.loanId
  entity.lender = event.params.lender
  entity.repaymentAmount = event.params.repaymentAmount
  entity.proportionalInteresPaid = event.params.proportionalInteresPaid
  entity.timePassed = event.params.timePassed
  entity.refundExcessAmount = event.params.refundExcessAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let loan = LoanStruct.load(event.params.loanId.toString())
  if (loan) {
    loan.status = LoanStatus.Repaid
    loan.save()
  }
}

export function handleLoanTermsSet(event: LoanTermsSetEvent): void {
  let entity = new LoanTermsSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.loanId = event.params.loanId
  entity.initialOwner = event.params.initialOwner
  entity.nftContractAddress = event.params.nftContractAddress
  entity.tokenId = event.params.tokenId
  entity.principal = event.params.principal
  entity.duration = event.params.duration
  entity.interest = event.params.interest

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let loan = new LoanStruct(event.params.loanId.toString())
  loan.loanId = event.params.loanId
  loan.initialOwner = event.params.initialOwner
  loan.nftContractAddress = event.params.nftContractAddress
  loan.tokenId = event.params.tokenId
  loan.principal = event.params.principal
  loan.duration = event.params.duration
  loan.interest = event.params.interest
  loan.status = LoanStatus.Available
  loan.save()
}

enum LoanStatus {
  Available,
  Active,
  Defaulted,
  Repaid,
}