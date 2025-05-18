import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { connectToDatabase } from "@/lib/db/mongodb"
import { compare } from "bcrypt"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        clientNumber: { label: "Número de Cliente", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.clientNumber || !credentials?.password) {
          return null;
        }

        try {
          // Conectar a la base de datos
          const db = await clientPromise;
          const clientesCollection = db.db("electricautomaticchile").collection("clientes");
          
          // Buscar cliente por número de cliente
          const cliente = await clientesCollection.findOne({ 
            numeroCliente: credentials.clientNumber
          });
          
          if (!cliente) {
            return null;
          }
          
          // Verificar contraseña
          // Si es la contraseña temporal, comparamos directamente
          const isPasswordTemp = cliente.passwordTemporal === credentials.password;
          
          // Si hay una contraseña hash, usamos bcrypt para comparar
          let isPasswordValid = isPasswordTemp;
          if (!isPasswordTemp && cliente.password) {
            isPasswordValid = await compare(credentials.password, cliente.password);
          }
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Si la autenticación es exitosa, devolvemos el usuario
          return {
            id: cliente._id.toString(),
            name: cliente.nombre,
            email: cliente.correo,
            clientNumber: cliente.numeroCliente,
            role: "empresa",
            image: null
          };
        } catch (error) {
          console.error("Error en la autenticación:", error);
          return null;
        }
      }
    })
  ],
  // @ts-ignore - Comentamos temporalmente para evitar errores de tipos
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Error al iniciar sesión
    signOut: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore - Agregamos propiedades personalizadas al objeto session.user
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.clientNumber = token.clientNumber;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore - Accedemos a propiedades personalizadas en el objeto user
        token.role = user.role;
        // @ts-ignore
        token.clientNumber = user.clientNumber;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Redireccionar a diferentes dashboards según el rol
      if (url.startsWith("/dashboard-")) {
        // La URL ya incluye dashboard específico, no modificar
        return url;
      }
      
      if (url.startsWith(baseUrl)) {
        // Redirecciones internas después del login
        const token = url.split("callbackUrl=")[1];
        if (token) {
          // Si hay un token JWT, decodificarlo para obtener el rol
          try {
            const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            if (decodedToken.role === "empresa") {
              return `${baseUrl}/dashboard-empresa`;
            }
            if (decodedToken.role === "admin" || decodedToken.role === "superadmin") {
              return `${baseUrl}/dashboard-superadmin`;
            }
          } catch (error) {
            console.error("Error al decodificar token:", error);
          }
        }
        
        // Por defecto, redirigir al dashboard de empresa
        return `${baseUrl}/dashboard-empresa`;
      }
      
      return url;
    }
  },
})

export { handler as GET, handler as POST } 