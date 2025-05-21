import { MongoClient, ServerApiVersion } from "mongodb"

// Utilizar variables de entorno para las credenciales
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/electricautomaticchile";
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
  socketTimeoutMS: 45000
}

// Validar que la URI de MongoDB está configurada
if (!process.env.MONGODB_URI) {
  console.warn("⚠️ La variable de entorno MONGODB_URI no está configurada. Usando URI local por defecto.");
}

// Manejar la conexión con más detalle
let client
let clientPromise: Promise<MongoClient>

// Crear una promesa envuelta para proporcionar más información sobre errores
const createMongoClient = async (): Promise<MongoClient> => {
  try {
    console.log("🔄 Intentando conectar a MongoDB...");
    const newClient = new MongoClient(uri, options);
    const connectedClient = await newClient.connect();
    console.log("✅ Conexión a MongoDB establecida exitosamente");
    return connectedClient;
  } catch (error: any) {
    console.error("❌ Error al conectar a MongoDB:", {
      message: error.message,
      name: error.name,
      code: error.code,
      uri: uri.split("@").length > 1 ? uri.split("@")[1] : "URI sin @"
    });
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = createMongoClient();
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = createMongoClient();
}

export default clientPromise 