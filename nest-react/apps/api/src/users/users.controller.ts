import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService, MetadataResult, Loan } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Fetches metadata for a given contract address and token ID
   * @param contract - The address of the contract
   * @param tokenId - The ID of the token
   * @returns The metadata for the token
   */
  @Get('/nfts/:contract/:tokenId')
  async findNfts(
    @Param('contract') contract: string,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ): Promise<MetadataResult> {
    try {
      return await this.usersService.getMetadata(contract, tokenId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch NFTs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetches all loans
   * @returns An array of all loans
   */
  @Get('/loans')
  async getLoans(): Promise<Loan[]> {
    try {
      return await this.usersService.getLoans();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch loans',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetches a loan by its index
   * @param index - The index of the loan
   * @returns The loan at the given index
   */
  @Get('/loans/:index')
  async getLoan(
    @Param('index', ParseIntPipe) index: number,
  ): Promise<string[]> {
    try {
      return await this.usersService.getLoan(index);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch loan at index ${index}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/loansIndexed')
  async getLoansIndexed() {
    const data = await this.usersService.getLoansIndexed();
    return data;
  }
}
