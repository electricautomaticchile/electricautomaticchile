import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CustomerProfileEdit() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    meterNumber: "",
    tariffPlan: "",
    paymentMethod: "",
    bankAccount: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Modificar perfil</CardTitle>
          <CardDescription>Modificar la información del perfil del cliente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primer nombre</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Segundo nombre</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de suministro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meterNumber">Número de medidor</Label>
            <Input id="meterNumber" name="meterNumber" value={formData.meterNumber} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tariffPlan">Plan de tarifa</Label>
            <Select onValueChange={handleSelectChange("tariffPlan")} value={formData.tariffPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un plan de tarifa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Estándar</SelectItem>
                <SelectItem value="timeOfUse">Tiempo de uso</SelectItem>
                <SelectItem value="renewable">100% Renovable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de facturación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de pago</Label>
            <Select onValueChange={handleSelectChange("paymentMethod")} value={formData.paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="directDebit">Débito directo</SelectItem>
                <SelectItem value="creditCard">Tarjeta de crédito</SelectItem>
                <SelectItem value="bankTransfer">Transferencia bancaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Cuenta bancaria / Número de tarjeta</Label>
            <Input id="bankAccount" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} required />
          </div>
        </CardContent>
      </Card>

      <CardFooter>
        <Button type="submit" className="w-full">Guardar cambios</Button>
      </CardFooter>
    </form>
  )
}
