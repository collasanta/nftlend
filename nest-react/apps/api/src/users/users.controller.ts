import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/nfts/:contract')
  findNfts(@Param('contract') contract: string) {
    return this.usersService.findNfts(contract);
  }
}
