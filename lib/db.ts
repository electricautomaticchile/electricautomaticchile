import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // En modo desarrollo, usa una variable global para preservar el valor
  // a través de recargas de módulos causadas por HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En modo producción, es mejor no usar una variable global.
  clientPromise = new MongoClient(uri, options).connect()
}

// Exporta una promesa de MongoClient con alcance de módulo.
export default clientPromise
