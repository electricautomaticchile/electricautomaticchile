
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {SignIn}  from "@/components/sign-in";


function Component() {

  return (
    <div className=" w-3/4 max-h-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Autenticación</h2>
        <p className="text-muted-foreground">Inicia sesión para continuar.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="Ingresa tu correo" />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
          <SignIn  />
        </div>
        <Link href="#" className="underline" prefetch={false}>
          <div className="text-center text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?{" "}
          </div>
        </Link>
      </div>
    </div>
    
  );
}
export default Component