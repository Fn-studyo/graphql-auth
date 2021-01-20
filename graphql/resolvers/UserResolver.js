const { getToken, encryptPassword, comparePassword } = require("../util");
const db = require("../../graphql/config/db");

const { AuthenticationError } = require("apollo-server");

const userResolvers = {
  Query: {
    me: (parent, args, context, info) => {
      // console.log(context.user)
      if (context.loggedIn) {
        return context.user;
      } else {
        throw new AuthenticationError("Please Login Again!");
      }
    }
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const newUser = {
        email: args.email,
        password: await encryptPassword(args.password)
      };
      // Check conditions
      const user = await db
        .getCollection("users")
        .findOne({ email: args.email });
      if (user) {
        throw new AuthenticationError("User Already Exists!");
      }
      try {
        const regUser = (await db.getCollection("users").insertOne(newUser))
          .ops[0];
        const token = getToken(regUser);
        return { ...regUser, token };
      } catch (e) {
        throw e;
      }
    },
    login: async (parent, args, context, info) => {
      const user = await db
        .getCollection("users")
        .findOne({ email: args.email });
      const isMatch = await comparePassword(args.password, user.password);
      if (isMatch) {
        const token = getToken(user);
        console.log(user);
        return { ...user, token };
      } else {
        throw new AuthenticationError("Wrong Password!");
      }
    }
  }
};

module.exports = {
  userResolvers
};
