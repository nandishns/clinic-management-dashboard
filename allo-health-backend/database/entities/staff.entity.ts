import { Entity, PrimaryGeneratedColumn } from "typeorm";

import { Column } from "typeorm";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  staffId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: false })
  isRegistered: boolean;
}