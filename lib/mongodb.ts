import { MongoClient, ServerApiVersion } from "mongodb";
import securityValidator from "./config/security";

// Obtener la configuración de seguridad validada
let mongodbUri: string;
try {
  const securityConfig = securityValidator.validateEnvironment();
  mongodbUri = securityConfig.mongodbUri;
} catch (error) {
  console.error("Error de configuración de seguridad:", error);
  throw error;
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};

// Manejar la conexión con más detalle
let client;
let clientPromise: Promise<MongoClient>;

// Crear una promesa envuelta para proporcionar más información sobre errores
const createMongoClient = async (): Promise<MongoClient> => {
  try {
    console.log("🔄 Intentando conectar a MongoDB...");
    const newClient = new MongoClient(mongodbUri, options);
    const connectedClient = await newClient.connect();
    console.log("✅ Conexión a MongoDB establecida exitosamente");
    return connectedClient;
  } catch (error: any) {
    console.error("❌ Error al conectar a MongoDB:", {
      message: error.message,
      name: error.name,
      code: error.code,
      uri:
        mongodbUri.split("@").length > 1
          ? mongodbUri.split("@")[1]
          : "URI sin @",
    });
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(mongodbUri, options);
    globalWithMongo._mongoClientPromise = createMongoClient();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(mongodbUri, options);
  clientPromise = createMongoClient();
}

export default clientPromise;
