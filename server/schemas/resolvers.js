//resolvers is a little more complicated than typeDefs, resolvers are functions that tell grqphql how to populate data for each field.
//resolvers can be "Queries" which are basically just get commands that can simply return data
//or "Mutations" that can be other kinds of requests that change the database in some way (delete data, change data, add data, etc.)

//we need to now make resolver routes for 5 routes in the restful api's user-routes file
//getSingleUser gets a single user by ID or username and returns the user object
//createUser creates a single user and creates a token, then returns the user
//this will require auth
//login takes a username or email and password, and checks if that password works for that username
//then, it signs a token and returns the token and user
//this will require auth
//saveBook updates the loggedInUser's savedBooks list to include the given bookId
//deleteBook updates the loggedInUser's savedBooks list to remove the given bookId
const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  //resolvers that simply return an object without any changes are queries.
  Query: {
    //the brackets destructure the inputs. Neither are required, so it will
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
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Can't find this user");

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) throw new Error("This password is incorrect");
      const token = signToken(user);
      //return an Auth
      return { token, user };
    },

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
