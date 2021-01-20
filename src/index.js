// src/index.js

const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const bodyParser = require("body-parser");

const app = express();



app.disable('x-powered-by');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// parse application/json
app.use(bodyParser.json())

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Provide resolver functions for your schema fields
const resolvers = {
    hello: () => "Hello world!"
};


app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue: resolvers
    })
);
app.listen(4000);

app.get('/', (req, res) => {
    return res.status(200).json({
        "status": 200,
        "message": `🚀 Server ready at http://localhost:4000/graphql`
    });
});

