import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from './appointment.entity';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: Gender;

  @Column()
  created_at: Date;

  @OneToMany(() => Queue, queue => queue.patient)
  queues: Queue[];

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];
} 