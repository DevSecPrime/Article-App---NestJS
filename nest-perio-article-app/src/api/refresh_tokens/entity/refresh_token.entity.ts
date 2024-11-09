import { AccessToken } from 'src/api/access_token/entity/accessToken.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => AccessToken, (accessTokens) => accessTokens.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  accessTokens: AccessToken;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRevoked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
