import { MongoClient } from 'mongodb'

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise() {
  if (globalForMongo.mongoClientPromise) return globalForMongo.mongoClientPromise

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Add it to the deployment environment before handling requests.')
  }

  const clientPromise = new MongoClient(uri).connect()
  if (process.env.NODE_ENV !== 'production') {
    globalForMongo.mongoClientPromise = clientPromise
  }
  return clientPromise
}

export async function getDatabase() {
  const connectedClient = await getClientPromise()
  return connectedClient.db(process.env.MONGODB_DB ?? 'cafora')
}
