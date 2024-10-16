"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function FormularioRegistro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoServicio: '',
    numeroCliente: '',
    aceptaTerminos: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipoServicio: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, aceptaTerminos: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    // Aquí iría la lógica para enviar los datos al servidor
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto space-y-6 py-12">
      <div className="max-w-md w-full rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Registro de Cliente
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Complete el formulario para registrarse en nuestro servicio de suministro eléctrico
          </p>
        </div>
        <form className="mt-8  space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="sr-only">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required

                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos" className="sr-only">Apellidos</Label>
                <Input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  required

                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="telefono" className="sr-only">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                required
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="numeroCliente" className="sr-only">Número de Cliente (si ya es cliente)</Label>
              <Input
                id="numeroCliente"
                name="numeroCliente"
                type="text"
                placeholder="Número de Cliente"
                value={formData.numeroCliente}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="aceptaTerminos"
              className="ml-2 block text-sm text-white"
            >
              Acepto los términos y condiciones
            </Label>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={!formData.aceptaTerminos}
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
