'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FileUpload from './file-upload'
import ImageViewer from './image-viewer'

type Ticket = {
  id: number
  title: string
  description: string
  status: 'abierto' | 'en progreso' | 'cerrado'
  files: File[]
}

export default function SoporteTecnico() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && description) {
      const newTicket: Ticket = {
        id: Date.now(),
        title,
        description,
        status: 'abierto',
        files
      }
      setTickets([...tickets, newTicket])
      setTitle('')
      setDescription('')
      setFiles([])
    }
  }

  const handleCloseTicket = (id: number) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: 'cerrado' } : ticket
    ))
  }

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles([...files, ...uploadedFiles])
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Crear un ticket</CardTitle>
          <CardDescription>Llena el formulario para crear un nuevo ticket de soporte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe un título breve para tu problema"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu problema en detalle"
                required
              />
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
            <Button type="submit">Enviar Ticket</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mis Tickets</CardTitle>
          <CardDescription>Lista de tus tickets de soporte actuales.</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p>No tienes tickets de soporte abiertos.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Estado: {ticket.status}</p>
                  {ticket.files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold">Archivos adjuntos:</p>
                      <ul className="list-disc list-inside">
                        {ticket.files.map((file, index) => (
                          <li key={index} className="text-xs">
                            {file.name}
                            {file.type.startsWith('image/') && (
                              <ImageViewer file={file} />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ticket.status !== 'cerrado' && (
                    <Button 
                      onClick={() => handleCloseTicket(ticket.id)}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Cerrar Ticket
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

