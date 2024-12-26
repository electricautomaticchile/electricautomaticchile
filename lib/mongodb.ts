import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usa un cliente MongoDB nuevo
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch(err => {
    console.error('Error de conexión a MongoDB:', err)
    throw new Error('Error de conexión a MongoDB')
  })
} else {
  // En producción, usa un cliente MongoDB existente
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
}

export default clientPromise 