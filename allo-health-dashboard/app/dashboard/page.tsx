"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QueueManagement from "@/components/QueueManagement"
import AppointmentManagement from "@/components/AppointmentManagement"
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("queue")
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="https://cdn.prod.website-files.com/61a4b9739ac56e51853f7bb2/63104b02a54e193fc31e5261_Allo%20Logo.webp"
                alt="Allo Health Clinic Logo"
                width={80}
                height={40}
              />
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Allo Health Clinic Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="queue">Queue Management</TabsTrigger>
              <TabsTrigger value="appointments">Appointment Management</TabsTrigger>
            </TabsList>
            <TabsContent value="queue" className="space-y-4">
              <QueueManagement />
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              <AppointmentManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}

