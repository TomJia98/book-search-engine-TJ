const User = require("../models/User");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("User is not logged in");
      }

      const user = context.user;

      const foundUser = await User.findOne({
        _id: user._id,
      });

      if (!foundUser) {
        throw new Error("User not found!");
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
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }

      const token = signToken(user);

      return {
        token,
        user,
      };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username,
        email,
        password,
      });

      if (!user) {
        throw new Error("Something is wrong!");
      }
      const token = signToken(user);

      return {
        token,
        user,
      };
    },
    saveBook: async (parent, { bookData }, context) => {
      const user = context.user;
      console.log(user);
      try {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error("Something is wrong!");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      const user = context.user;
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
