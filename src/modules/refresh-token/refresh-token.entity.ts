import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('refreshtokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  accessToken?: string;

  @Column()
  refreshToken: string;

  @Column({default: false})
  isUsed: boolean;

  @Column({default: false})
  IsRevoked: boolean;

  @Column()
  addedDate: Date;

  @Column()
  expiryTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
