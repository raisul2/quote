import { ApolloServer } from "apollo-server";
import { config } from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from 'path'
config({ path: ".env" });

mongoose.connect(process.env.DBURL, {});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("error", (err) => {
  console.log("connecte", err);
});

// import models

import "./models/User.js";
import "./models/Quote.js";

import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/typeDefs.js";

// this is middle were

const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.SEC_KEY);
    return { userId };
  }
};






const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});





server.listen().then(({ url }) => {
  console.log(`Server ready to ${url}`);
});
