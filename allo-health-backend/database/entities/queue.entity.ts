import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

enum QueueStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  queue_number: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING
  })
  status: QueueStatus;

  @ManyToOne(() => Patient, patient => patient.queues)
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.queues)
  doctor: Doctor;
} 