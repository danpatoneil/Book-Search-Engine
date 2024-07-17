//resolvers is a little more complicated than typeDefs, resolvers are functions that tell grqphql how to populate data for each field.
//resolvers can be "Queries" which are basically just get commands that can simply return data
//or "Mutations" that can be other kinds of requests that change the database in some way (delete data, change data, add data, etc.)

const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  //resolvers that simply return an object without any changes are queries.
  Query: {
    //this query will respond with the user object for the logged in user
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({
          _id: context.user._id,
        });
        return user;
      } else {
        throw AuthenticationError;
      }
    },
  },
  Mutation: {
    //log in the user denoted by the email and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Can't find this user");

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) throw new Error("This password is incorrect");
      const token = signToken(user);
      //return an Auth
      return { token, user };
    },

    //create a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user)
        throw new Error(
          "Something has gone awry, perhaps one or more of your parameters are incorrect"
        );
      const token = signToken(user);
      //returns an Auth type
      return { token, user };
    },

    //saves given book to logged in user
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const user = await User.findOne({
          _id: context.user._id,
        });
        user.savedBooks.push(input);
        await user.save();
        return user;
      } else {
        throw AuthenticationError;
      }
    },

    //remove the given book from the logged in user
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOne({
          _id: context.user._id,
        });
        user.savedBooks = user.savedBooks.filter(
          (book) => book.bookId !== bookId
        );
        await user.save();
        return user;
      } else {
        throw AuthenticationError;
      }
    },
  },
};

module.exports = resolvers;
