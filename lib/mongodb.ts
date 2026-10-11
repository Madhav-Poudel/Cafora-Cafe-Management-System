import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not configured. Add it to .env.local before starting the app.')
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>
}

const client = new MongoClient(uri)
const clientPromise = globalForMongo.mongoClientPromise ?? client.connect()

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.mongoClientPromise = clientPromise
}

export async function getDatabase() {
  const connectedClient = await clientPromise
  return connectedClient.db(process.env.MONGODB_DB ?? 'cafora')
}
