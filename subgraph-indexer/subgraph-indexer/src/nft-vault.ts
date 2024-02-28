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
  LoanTermsSet
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
}
