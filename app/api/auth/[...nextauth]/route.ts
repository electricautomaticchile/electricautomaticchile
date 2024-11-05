import Google from "next-auth/providers/google"
import NextAuth from "next-auth"

const { handlers} = NextAuth({
  providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_SECRET as string
    }),

  ],
})
export const { GET, POST } = handlers
