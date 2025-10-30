import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginatedResult } from '../../common/models/paginated-result';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getPagedUsers(
    @Query('page') page = 1,
    @Query('size') size = 10,
  ): Promise<PaginatedResult<User>> {
    return this.userService.getPagedUsers(Number(page), Number(size));
  }
}
