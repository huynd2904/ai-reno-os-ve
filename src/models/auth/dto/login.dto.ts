import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
