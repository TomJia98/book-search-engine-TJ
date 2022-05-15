const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");
//change this

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!req.user) {
        throw new Error("user is not logged in");
      }
      const user = req.user;

      const foundUser = await User.findOne({
        _id: user._id,
      });

      if (!foundUser) {
        throw new Error("user not found");
      }
      return foundUser;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        throw new Error("cant find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }
      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username: username,
        email: email,
        password: password,
      });

      if (!user) {
        throw new Error("something went wrong");
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
