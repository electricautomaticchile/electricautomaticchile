import Google from "next-auth/providers/google"
import NextAuth from "next-auth"

const { handlers} = NextAuth({
  providers: [
    Google({
      clientId:process.env.AUTH_GOOGLE_ID,
      clientSecret:process.env.AUTH_GOOGLE_SECRET,
    }),
   
  ],
  secret:process.env.AUTH_SECRET
})
export const { GET, POST } = handlers