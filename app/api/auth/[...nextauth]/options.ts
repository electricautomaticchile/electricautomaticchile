import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcrypt";
import { logger } from '@/lib/utils/logger';

// Función para registrar información de debug más detallada
function logAuthInfo(context: string, data: any) {
  logger.auth(`${context}`, {
    ...data,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'no configurado',
    hasMongoDB: !!process.env.MONGODB_URI,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasGoogleCreds: !!(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET)
  });
}

function debugLog(context: string, data?: any) {
  logger.auth(`${context}`, data);
}

export const authOptions: NextAuthOptions = {
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
          logAuthInfo("Authorize - credenciales incompletas", { clientNumber: !!credentials?.clientNumber });
          return null;
        }

        try {
          logAuthInfo("Authorize - intentando conexión", { 
            clientNumber: credentials.clientNumber,
            passwordLength: credentials.password?.length || 0
          });
          
          // Conectar a la base de datos
          const db = await clientPromise;
          const clientesCollection = db.db("electricautomaticchile").collection("clientes");
          
          logAuthInfo("Authorize - conexión a BD exitosa", { 
            dbConnected: !!db,
            collectionExists: !!clientesCollection 
          });
          
          // Buscar cliente por número de cliente
          const cliente = await clientesCollection.findOne({ 
            numeroCliente: credentials.clientNumber
          });
          
          if (!cliente) {
            logAuthInfo("Authorize - cliente no encontrado", { 
              clientNumber: credentials.clientNumber 
            });
            return null;
          }
          
          logAuthInfo("Authorize - cliente encontrado", { 
            clienteId: cliente._id,
            hasPassword: !!cliente.password,
            hasPasswordTemp: !!cliente.passwordTemporal,
            role: cliente.role || "empresa"
          });
          
          // Verificar contraseña
          // Si es la contraseña temporal, comparamos directamente
          const isPasswordTemp = cliente.passwordTemporal === credentials.password;
          
          // Si hay una contraseña hash, usamos bcrypt para comparar
          let isPasswordValid = isPasswordTemp;
          if (!isPasswordTemp && cliente.password) {
            isPasswordValid = await compare(credentials.password, cliente.password);
          }
          
          if (!isPasswordValid) {
            logAuthInfo("Authorize - contraseña inválida", { 
              isPasswordTemp,
              hasPasswordHash: !!cliente.password
            });
            return null;
          }
          
          logAuthInfo("Authorize - autenticación exitosa", { 
            id: cliente._id.toString(),
            role: cliente.role || "empresa"
          });
          
          // Si la autenticación es exitosa, devolvemos el usuario
          return {
            id: cliente._id.toString(),
            name: cliente.nombre,
            email: cliente.correo,
            clientNumber: cliente.numeroCliente,
            role: cliente.role || "empresa",
            image: null
          };
        } catch (error: any) {
          logAuthInfo("Authorize - error", { 
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          logger.error("Error en la autenticación", error);
          return null;
        }
      }
    })
  ],
  // @ts-ignore - Comentamos temporalmente para evitar errores de tipos
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Error al iniciar sesión
    signOut: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async session({ session, token }) {
      logAuthInfo("Session callback", { 
        sessionExists: !!session,
        tokenExists: !!token,
        tokenSub: token?.sub
      });
      
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.clientNumber = token.clientNumber as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      logAuthInfo("JWT callback", { 
        tokenExists: !!token,
        userExists: !!user,
        userRole: user?.role
      });
      
      if (user) {
        token.role = user.role;
        token.clientNumber = user.clientNumber;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      logAuthInfo("Redirect callback", { url, baseUrl });
      
      // Detectar si hay información de rol en la URL (desde una sesión anterior)
      let userRole = "empresa";
      if (url.includes("token=")) {
        try {
          const tokenPart = url.split("token=")[1].split("&")[0];
          const decodedToken = JSON.parse(Buffer.from(tokenPart.split('.')[1], 'base64').toString());
          userRole = decodedToken.role;
          logAuthInfo("Token decodificado en URL", { 
            userRole,
            tokenExists: !!tokenPart
          });
        } catch (error: any) {
          logAuthInfo("Error decodificando token en URL", { 
            error: error.message,
            url
          });
          logger.error("Error decodificando token en URL", error);
        }
      }
      
      // Si el usuario es admin/superadmin, priorizar siempre dashboard-superadmin
      if (userRole === "admin" || userRole === "superadmin") {
        const redirectUrl = `${baseUrl}/dashboard-superadmin`;
        logAuthInfo("Redirigiendo a dashboard admin", { redirectUrl });
        return redirectUrl;
      }
      
      // Si la URL es absoluta y pertenece a nuestro dominio, usarla directamente
      if (url.startsWith(baseUrl)) {
        logAuthInfo("URL pertenece al dominio base", { url });
        return url;
      }
      
      // Si es una URL de callback con un token codificado
      if (url.includes('callbackUrl=')) {
        const callbackUrl = decodeURIComponent(url.split('callbackUrl=')[1]);
        logAuthInfo("URL tiene callbackUrl", { 
          callbackUrl,
          belongsToDomain: callbackUrl.startsWith(baseUrl)
        });
        
        // Verificar que la URL de callback sea segura (pertenezca a nuestro dominio)
        if (callbackUrl.startsWith(baseUrl)) return callbackUrl;
      }
      
      // Si es una ruta interna específica de dashboard, permitirla
      if (url.startsWith('/dashboard-')) {
        logAuthInfo("Ruta interna de dashboard", { url });
        return url;
      }
      
      // Por defecto, ir a la página principal
      logAuthInfo("Redirigiendo a página principal", { baseUrl });
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 