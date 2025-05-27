const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const MONGO_URI = "mongodb://localhost:27017"; // Local MongoDB URI
const PORT = 4000;

const typeDefs = `#graphql
  type Task {
    _id: ID!
    title: String!
    description: String
    status: String
    dueDate: String
  }

  type Query {
    getTasks: [Task]
    getTaskById(id: ID!): Task
    filterTasksByStatus(status: String!): [Task]
  }

  type Mutation {
    addTask(title: String!, description: String, status: String, dueDate: String): Task
    updateTaskStatus(id: ID!, status: String!): Task
  }
`;

let db;

const resolvers = {
  Query: {
    getTasks: async () => await db.collection("tasks").find().toArray(),
    getTaskById: async (_, { id }) =>
      await db.collection("tasks").findOne({ _id: new ObjectId(id) }),
    filterTasksByStatus: async (_, { status }) =>
      await db.collection("tasks").find({ status }).toArray(),
  },
  Mutation: {
    addTask: async (_, { title, description, status, dueDate }) => {
      const newTask = { title, description, status, dueDate };
      const result = await db.collection("tasks").insertOne(newTask);
      return { _id: result.insertedId, ...newTask };
    },
    updateTaskStatus: async (_, { id, status }) => {
      await db
        .collection("tasks")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
      return await db.collection("tasks").findOne({ _id: new ObjectId(id) });
    },
  },
};

async function startServer() {
  const app = express();
  app.use(cors());

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("taskDB"); // You can rename this DB if needed

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () =>
      console.log(
        `🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
}

startServer();
