const express = require("express");
//import appolloserver and the expressmiddleware for the appollo server
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require('./utils/auth');

//the routes files will not be used once the graphql is set up, so we don't need to import them
// const routes = require('./routes');
// import our typeDefs and resolvers, which will fulfill the same function
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;
//instantiate the appollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
//bundle everything into an async function so we can use the await functionality for server.start
const startApolloServer = async () => {
  //start the server
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // tell express to use graphql

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
    //on any basic request, load the index file
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
  // normal routes aren't being used for this, we're running on graphql instead
  //   app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}
        Use GraphQL at http://localhost:${PORT}/graphql`)
    );
  });
};

//then call the server
startApolloServer();
