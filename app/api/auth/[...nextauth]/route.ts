import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { connectToDatabase } from "@/lib/db/mongodb"
import { compare } from "bcrypt"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { authOptions } from "./options"

// Extender los tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      clientNumber: string;
    }
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    clientNumber: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    clientNumber?: string;
  }
}

// Exportar el handler de NextAuth
export { authOptions }
export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 