import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'FirstName' })
  firstName: string;

  @ApiProperty({ example: 'LastName', required: false })
  lastName?: string;

  @ApiProperty({ example: 'Email' })
  email?: string;

  @ApiProperty({ example: 'Username' })
  username: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
