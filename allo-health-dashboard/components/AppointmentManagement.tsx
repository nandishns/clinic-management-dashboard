"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { format, addDays, parseISO } from 'date-fns'
import { cn } from "@/lib/utils"
import BookAppointmentDialog from "./BookAppointmentDialog"
import CancelRescheduleDialog from "./CancelRescheduleDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Doctor = {
  id: number
  name: string
  specialty: string
  status: "Available" | "Busy" | "Off Duty"
  nextAvailable: string
}

const doctors: Doctor[] = [
  { id: 1, name: "Dr. Smith", specialty: "General Practice", status: "Available", nextAvailable: "Now" },
  { id: 2, name: "Dr. Johnson", specialty: "Pediatrics", status: "Busy", nextAvailable: "2:30 PM" },
  { id: 3, name: "Dr. Lee", specialty: "Cardiology", status: "Off Duty", nextAvailable: "Tomorrow 9:00 AM" },
  { id: 4, name: "Dr. Patel", specialty: "Dermatology", status: "Available", nextAvailable: "Now" },
]

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
]

type Appointment = {
  id: number
  doctorId: number
  patientName: string
  date: Date
  time: string
}

export default function AppointmentManagement() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const maxDate = addDays(new Date(), 30)

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || doctor.status.toLowerCase() === filter)
  )

  const handleBookAppointment = (doctorId: number, date: Date, time: string, patientName: string) => {
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      doctorId,
      patientName,
      date,
      time
    }
    setAppointments([...appointments, newAppointment])
    toast({
      title: "Appointment Booked",
      description: `Appointment booked for ${patientName} with Dr. ${doctors.find(d => d.id === doctorId)?.name} on ${format(date, 'MMM dd, yyyy')} at ${time}`,
    })
  }

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId))
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled successfully.",
      variant: "destructive"
    })
  }

  const handleRescheduleAppointment = (appointmentId: number, newDate: Date, newTime: string) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId ? { ...a, date: newDate, time: newTime } : a
    ))
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment rescheduled to ${format(newDate, 'MMM dd, yyyy')} at ${newTime}`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="off duty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find available doctors.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        doctor.status === "Available"
                          ? "default"
                          : doctor.status === "Busy"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {doctor.status}
                    </Badge>
                    <p className="text-sm text-gray-500">Next available: {doctor.nextAvailable}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Schedule</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{doctor.name}'s Schedule</DialogTitle>
                          <DialogDescription>Available time slots for the next 3 days</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentDate((prev) => addDays(prev, -1))}
                              disabled={currentDate <= new Date()}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous Day
                            </Button>
                            <span className="font-medium text-gray-900">
                              {format(currentDate, 'EEEE, MMM dd')}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentDate((prev) => addDays(prev, 1))}
                              disabled={currentDate >= maxDate}
                            >
                              Next Day
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <BookAppointmentDialog
                                key={slot}
                                doctorId={doctor.id}
                                date={currentDate.toISOString().split('T')[0]}
                                time={slot}
                                onBookAppointment={handleBookAppointment}
                                doctors={doctors}
                              >
                                <Button variant="outline" size="sm" className="w-full">
                                  {slot}
                                </Button>
                              </BookAppointmentDialog>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booked Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments booked</h3>
              <p className="mt-1 text-sm text-gray-500">Book an appointment to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const doctor = doctors.find(d => d.id === appointment.doctorId)
                return (
                  <div key={appointment.id} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">
                        With {doctor?.name} on {format(appointment.date, 'MMM dd, yyyy')} at {appointment.time}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <CancelRescheduleDialog
                        appointment={appointment}
                        onCancel={handleCancelAppointment}
                        onReschedule={handleRescheduleAppointment}
                      >
                        <Button variant="outline" size="sm">Manage</Button>
                      </CancelRescheduleDialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <BookAppointmentDialog
        doctors={doctors}
        onBookAppointment={handleBookAppointment}
      >
        <Button className="w-full" size="lg">
          <Calendar className="mr-2 h-4 w-4" /> Book Appointment
        </Button>
      </BookAppointmentDialog>
    </div>
  )
}

