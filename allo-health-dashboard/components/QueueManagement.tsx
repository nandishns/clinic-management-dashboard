import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Search, UserPlus, X, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type Patient = {
  id: number
  name: string
  status: "Waiting" | "With Doctor" | "Completed"
  arrivalTime: string
  estimatedWait: string
  priority: "Normal" | "Urgent"
}

export default function QueueManagement() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const filteredPatients = patients.filter(
    (patient) =>
      (filter === "All" || patient.status === filter) &&
      patient.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusChange = (patientId: number, newStatus: Patient["status"]) => {
    setPatients(
      patients.map((patient) =>
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      )
    )
    toast({
      title: "Status Updated",
      description: `Patient status changed to ${newStatus}`,
    })
  }

  const handlePriorityChange = (patientId: number, newPriority: Patient["priority"]) => {
    setPatients(
      patients.map((patient) =>
        patient.id === patientId ? { ...patient, priority: newPriority } : patient
      )
    )
    toast({
      title: "Priority Updated",
      description: `Patient priority changed to ${newPriority}`,
    })
  }

  const handleRemovePatient = (patientId: number) => {
    setPatients(patients.filter((patient) => patient.id !== patientId))
    toast({
      title: "Patient Removed",
      description: "Patient has been removed from the queue",
      variant: "destructive",
    })
  }

  const handleAddPatient = (name: string, priority: "Normal" | "Urgent") => {
    const newPatient: Patient = {
      id: patients.length + 1,
      name,
      status: "Waiting",
      arrivalTime: new Date().toLocaleTimeString(),
      estimatedWait: "15 min",
      priority,
    }
    setPatients([...patients, newPatient])
    toast({
      title: "Patient Added",
      description: `${name} has been added to the queue`,
    })
    setOpen(false) // Close the dialog after adding the patient
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Select onValueChange={setFilter} defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Waiting">Waiting</SelectItem>
              <SelectItem value="With Doctor">With Doctor</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No patients</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new patient to the queue.</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Arrived: {patient.arrivalTime}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. Wait: {patient.estimatedWait}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Select
                            defaultValue={patient.status}
                            onValueChange={(value) => handleStatusChange(patient.id, value as Patient["status"])}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Waiting">Waiting</SelectItem>
                              <SelectItem value="With Doctor">With Doctor</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change patient status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Select
                            defaultValue={patient.priority}
                            onValueChange={(value) => handlePriorityChange(patient.id, value as Patient["priority"])}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change patient priority</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently remove the patient from the queue.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemovePatient(patient.id)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove patient from queue</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Patient to Queue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient's details to add them to the queue.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get('name') as string
              const priority = formData.get('priority') as "Normal" | "Urgent"
              if (name && priority) {
                handleAddPatient(name, priority)
                e.currentTarget.reset()
              }
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select name="priority" defaultValue="Normal">
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Patient</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

