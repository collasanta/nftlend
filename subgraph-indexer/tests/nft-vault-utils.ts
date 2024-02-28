import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  DefaultCollateral,
  LoanLended,
  LoanRepaid,
  LoanTermsSet
} from "../generated/NFTVault/NFTVault"

export function createDefaultCollateralEvent(
  loanId: BigInt,
  initialOwner: Address
): DefaultCollateral {
  let defaultCollateralEvent = changetype<DefaultCollateral>(newMockEvent())

  defaultCollateralEvent.parameters = new Array()

  defaultCollateralEvent.parameters.push(
    new ethereum.EventParam("loanId", ethereum.Value.fromUnsignedBigInt(loanId))
  )
  defaultCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "initialOwner",
      ethereum.Value.fromAddress(initialOwner)
    )
  )

  return defaultCollateralEvent
}

export function createLoanLendedEvent(
  loanId: BigInt,
  lender: Address,
  startDate: BigInt
): LoanLended {
  let loanLendedEvent = changetype<LoanLended>(newMockEvent())

  loanLendedEvent.parameters = new Array()

  loanLendedEvent.parameters.push(
    new ethereum.EventParam("loanId", ethereum.Value.fromUnsignedBigInt(loanId))
  )
  loanLendedEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  loanLendedEvent.parameters.push(
    new ethereum.EventParam(
      "startDate",
      ethereum.Value.fromUnsignedBigInt(startDate)
    )
  )

  return loanLendedEvent
}

export function createLoanRepaidEvent(
  loanId: BigInt,
  lender: Address,
  repaymentAmount: BigInt,
  proportionalInteresPaid: BigInt,
  timePassed: BigInt,
  refundExcessAmount: BigInt
): LoanRepaid {
  let loanRepaidEvent = changetype<LoanRepaid>(newMockEvent())

  loanRepaidEvent.parameters = new Array()

  loanRepaidEvent.parameters.push(
    new ethereum.EventParam("loanId", ethereum.Value.fromUnsignedBigInt(loanId))
  )
  loanRepaidEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  loanRepaidEvent.parameters.push(
    new ethereum.EventParam(
      "repaymentAmount",
      ethereum.Value.fromUnsignedBigInt(repaymentAmount)
    )
  )
  loanRepaidEvent.parameters.push(
    new ethereum.EventParam(
      "proportionalInteresPaid",
      ethereum.Value.fromUnsignedBigInt(proportionalInteresPaid)
    )
  )
  loanRepaidEvent.parameters.push(
    new ethereum.EventParam(
      "timePassed",
      ethereum.Value.fromUnsignedBigInt(timePassed)
    )
  )
  loanRepaidEvent.parameters.push(
    new ethereum.EventParam(
      "refundExcessAmount",
      ethereum.Value.fromUnsignedBigInt(refundExcessAmount)
    )
  )

  return loanRepaidEvent
}

export function createLoanTermsSetEvent(
  loanId: BigInt,
  initialOwner: Address,
  nftContractAddress: Address,
  tokenId: BigInt,
  principal: BigInt,
  duration: BigInt,
  interest: BigInt
): LoanTermsSet {
  let loanTermsSetEvent = changetype<LoanTermsSet>(newMockEvent())

  loanTermsSetEvent.parameters = new Array()

  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam("loanId", ethereum.Value.fromUnsignedBigInt(loanId))
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "initialOwner",
      ethereum.Value.fromAddress(initialOwner)
    )
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "nftContractAddress",
      ethereum.Value.fromAddress(nftContractAddress)
    )
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "principal",
      ethereum.Value.fromUnsignedBigInt(principal)
    )
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  loanTermsSetEvent.parameters.push(
    new ethereum.EventParam(
      "interest",
      ethereum.Value.fromUnsignedBigInt(interest)
    )
  )

  return loanTermsSetEvent
}
