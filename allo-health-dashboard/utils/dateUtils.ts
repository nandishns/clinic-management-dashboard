export const getNextAvailableDisplay = (schedules: Array<{ slots: Array<{ status: string; time: string }> }>) => {
  const nextSlot = schedules.find(schedule => 
    schedule.slots.some(slot => slot.status === "AVAILABLE"))?.slots
    .find(slot => slot.status === "AVAILABLE");

  if (!nextSlot) return "No availability";
  
  const time = nextSlot.time;
  const now = new Date();
  const [hours, minutes] = time.split(':');
  const slotTime = new Date(now.setHours(Number(hours), Number(minutes)));

  if (slotTime.getTime() < now.getTime()) {
    return "Tomorrow " + time;
  }
  return slotTime.getTime() - now.getTime() < 3600000 ? 
    "Now" : 
    "Today " + time;
}; 