import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Index,
} from 'typeorm';

@Entity({ name: 'air_quailty' })
@Index('idx_air_quality_index', ['aqicn'])
export class AirQuality extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'smallint' })
  aqius: number;

  @Column({ type: 'smallint' })
  aqicn: number;

  @Column('varchar', { length: 255, name: 'city' })
  city: string;

  @Column('varchar', { length: 255, name: 'date' })
  date: string;

  @Column('varchar', { length: 255, name: 'time' })
  time: string;

  @Column({
    type: 'datetime',
    name: 'timestamp',
  })
  timestamp: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
