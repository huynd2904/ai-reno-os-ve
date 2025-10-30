import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../common/models/paginated-result';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

  ) {}

  async getPagedUsers(page = 1, size = 10): Promise<PaginatedResult<User>> {
    const query = this.userRepo.createQueryBuilder('user').orderBy('user.createdAt', 'DESC');
    return PaginatedResult.fromQuery<User>(query, page, size);
  }

  async getUserById(id: string) : Promise<User | null>{
   return await this.userRepo.findOne({where:{id}});
  }
}
