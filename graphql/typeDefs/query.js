const { gql } = require("apollo-server");
const query = gql`
  type Query {
    me: User
  }
  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

module.exports = { query };
