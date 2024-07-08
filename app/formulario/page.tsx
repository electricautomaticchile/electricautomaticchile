import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Contacto</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Ingresa tu nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electronico</Label>
          <Input id="email" type="email" placeholder="Ingresa tu correo electronico" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea id="message" placeholder="Ingresa tu mensaje" className="min-h-[120px]" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fileInput">Adjunta Archivo</Label>
          <Input  id="fileInput" name="file"  type="file" />
        </div>
        <Button type="submit" className="w-full">
          Enviar
        </Button>
      </form>
    </div>
  )
}