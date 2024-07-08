import { Button } from "./ui/button"
import { signIn } from "@/auth"
 
function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button  className="w-full" type="submit">Iniciar Sesion con Google</Button>
    </form>
  )
} 

export default SignIn