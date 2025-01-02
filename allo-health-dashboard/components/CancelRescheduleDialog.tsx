import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, parseISO } from 'date-fns'
import { useToast } from "@/hooks/use-toast"

type CancelRescheduleDialogProps = {
  children: React.ReactNode
  appointment: {
    id: number
    date: Date
    time: string
  }
  onCancel: (appointmentId: number) => void
  onReschedule: (appointmentId: number, newDate: Date, newTime: string) => void
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
]

export default function CancelRescheduleDialog({ children, appointment, onCancel, onReschedule }: CancelRescheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newTime, setNewTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCancel = async () => {
    setIsSubmitting(true)
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onCancel(appointment.id)
    setOpen(false)
    setIsSubmitting(false)
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    })
  }

  const handleReschedule = async () => {
    if (newDate && newTime) {
      setIsSubmitting(true)
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onReschedule(appointment.id, parseISO(newDate), newTime)
      setOpen(false)
      setIsSubmitting(false)
      toast({
        title: "Appointment Rescheduled",
        description: `Your appointment has been rescheduled to ${format(parseISO(newDate), 'MMMM d, yyyy')} at ${newTime}.`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Appointment</DialogTitle>
          <DialogDescription>
            Cancel or reschedule your appointment on {format(appointment.date, 'MMMM d, yyyy')} at {appointment.time}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={setNewDate}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select new date" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                  const date = addDays(new Date(), dayOffset)
                  return (
                    <SelectItem key={dayOffset} value={date.toISOString()}>
                      {format(date, 'EEEE, MMM dd')}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={setNewTime}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select new time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCancel} variant="destructive" disabled={isSubmitting}>
            {isSubmitting ? "Cancelling..." : "Cancel Appointment"}
          </Button>
          <Button onClick={handleReschedule} disabled={!newDate || !newTime || isSubmitting}>
            {isSubmitting ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

