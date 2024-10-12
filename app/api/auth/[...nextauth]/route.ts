import Google from "next-auth/providers/google"
import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"

//providers y base de datos//

const { handlers ,auth, signIn, signOut} = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_SECRET as string
    }),

  ],
  secret:process.env.SECRET
})
export const { GET, POST } = handlers
