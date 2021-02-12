const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("../graphql/typeDefs");
const { resolvers } = require("../graphql/resolvers");
const { getPayload } = require("../graphql/util");
const db = require("../graphql/config/db");
const express = require("express");
const config = require("../graphql/config");

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Connect to DB
    db.connect(config.database, (err) => {
      if (err) {
        console.log("Could not connect to the database. Exiting now...", err);
      } else {
        console.log("Successfully Connected to MongoDB!");
      }
    });

    // get the user token from the headers
    const token = req.headers.authorization || "";
    // try to retrieve a user with the token
    const { payload: user, loggedIn } = getPayload(token);

    // add the user to the context
    return { user, loggedIn };
  }
});

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: `🚀 Server ready at ------`
  });
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
