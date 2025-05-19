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
  console.warn("La variable de entorno MONGODB_URI no está configurada. Usando URI local por defecto.");
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise 