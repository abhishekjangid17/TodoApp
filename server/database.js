require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;

const options = {
  tls: true,  // Enforce SSL/TLS connection
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};


let client;
let db; // Store the database instance

const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = new MongoClient(uri, options); // Use new MongoClient()
      await client.connect();
      db = client.db("todosdb"); // Connect to the correct database
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
  return db;
};

const getConnectedClient = () => client;
const getDatabase = () => db; // Function to get the database instance

module.exports = { connectToMongoDB, getConnectedClient, getDatabase };
