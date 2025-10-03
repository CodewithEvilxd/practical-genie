import { MongoClient, ServerApiVersion } from "mongodb";

let clientSingleton: MongoClient | null = null;

export function getMongoClient(uri?: string): MongoClient {
  if (clientSingleton) return clientSingleton;
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI not configured");
  }
  clientSingleton = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return clientSingleton;
}

export async function getMongoDb(dbName?: string) {
  const client = getMongoClient();
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  const name = dbName || process.env.MONGODB_DB || "practical-genie";
  return client.db(name);
}


