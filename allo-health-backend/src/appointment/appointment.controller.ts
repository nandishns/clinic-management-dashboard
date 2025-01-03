import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from 'database/entities/appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get('get')
  async getAppointments(
    @Query('doctorId') doctorId?: number,
    @Query('patientId') patientId?: number,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.getAppointments({ doctorId, patientId, status });
  }

  @Put('update')
  async updateAppointment(
    @Body() updates: Partial<CreateAppointmentDto>,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.appointmentService.updateAppointment(id, updates);
  }

  @Delete('cancel')
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.cancelAppointment(id);
  }
} 