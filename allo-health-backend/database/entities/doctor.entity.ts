import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from './appointment.entity';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: Gender;

  @Column('json')
  availability: any;

  @OneToMany(() => Queue, queue => queue.doctor)
  queues: Queue[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
} 