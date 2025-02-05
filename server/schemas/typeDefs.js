//typeDefs defines the types of information that can be provided to graphql. It consists of a single interpolated string.
const typeDefs = `
  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks:[Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email:String!, password:String!): Auth
    addUser(username:String!, email:String!, password:String!): Auth
    saveBook(input:BookInput): User
    removeBook(bookId:String!): User
  }
`;

module.exports = typeDefs;


