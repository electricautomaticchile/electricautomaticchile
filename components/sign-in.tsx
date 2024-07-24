import { Button } from "./ui/button"
import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}
    >
      <Button  className="w-full" type="submit">Iniciar Sesion con Google</Button>
    </form>
  )
} 

