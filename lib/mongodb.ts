import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Falta la variable de entorno MONGODB_URI')
}

const uri = process.env.MONGODB_URI
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error('La URI de MongoDB debe comenzar con "mongodb://" o "mongodb+srv://"')
}

const options = {}

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