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
import { logger } from '@/lib/utils/logger'

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

// Manejar errores en la inicialización del controlador
let GET: any;
let POST: any;

try {
  logger.auth("Inicializando NextAuth");
  logger.debug("Variables de entorno configuradas", {
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    MONGODB_URI: !!process.env.MONGODB_URI,
    GOOGLE_ID: !!process.env.GOOGLE_ID,
    GOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
  });
  
  // Asegurarse que NEXTAUTH_SECRET tiene un valor
  if (!authOptions.secret && !process.env.NEXTAUTH_SECRET) {
    logger.warn("No se ha configurado NEXTAUTH_SECRET. La autenticación puede fallar.");
  }
  
  // Configuración de NextAuth
  const handler = NextAuth(authOptions);
  logger.auth("NextAuth inicializado correctamente");
  
  GET = handler;
  POST = handler;
} catch (error: any) {
  logger.error("Error al inicializar NextAuth", error);
  
  // Proporcionar un handler alternativo para devolver el error
  const errorHandler = async () => {
    return new Response(JSON.stringify({
      error: "Error al inicializar NextAuth",
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  };
  
  GET = errorHandler;
  POST = errorHandler;
}

export { GET, POST }; 