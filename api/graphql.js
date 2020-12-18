const { ApolloServer } = require("apollo-server-micro");
const { getUserFromToken } = require("./auth");
const cors = require("micro-cors")();
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    try {
      // Get the user token from the headers.
      const token = req.headers.authorization || req.cookies.token || "";
      if (token) {
        // try to retrieve a user with the token
        const user = getUserFromToken(token);
        // add the user to the context
        return {
          user
        };
      }

    } catch (error) {
      console.log("Un token es requerido. Error: ", error);
    }
    return {};
  }
});
const handler = server.createHandler({
  path: "/api/graphql",
  introspection: true
});

module.exports = cors((req, res) =>
  req.method === "OPTIONS" ? res.end() : handler(req, res)
);