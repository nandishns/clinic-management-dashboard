import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Patient, patient => patient.appointments)
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;
} 