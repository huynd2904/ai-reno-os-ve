import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken'})
  refreshToken: string;
}
