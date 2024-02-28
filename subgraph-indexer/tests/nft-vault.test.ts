import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { DefaultCollateral } from "../generated/schema"
import { DefaultCollateral as DefaultCollateralEvent } from "../generated/NFTVault/NFTVault"
import { handleDefaultCollateral } from "../src/nft-vault"
import { createDefaultCollateralEvent } from "./nft-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let loanId = BigInt.fromI32(234)
    let initialOwner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDefaultCollateralEvent = createDefaultCollateralEvent(
      loanId,
      initialOwner
    )
    handleDefaultCollateral(newDefaultCollateralEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DefaultCollateral created and stored", () => {
    assert.entityCount("DefaultCollateral", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DefaultCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "loanId",
      "234"
    )
    assert.fieldEquals(
      "DefaultCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "initialOwner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
