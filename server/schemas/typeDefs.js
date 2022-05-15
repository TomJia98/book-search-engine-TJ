const { gql } = require("apollo-server-express");
//change this
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type: Author {
    name: String!
 }
 

  type Book {
    _id: ID!
    authors: [Author]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: String!
    user: User

  } 

  type Query {
    me: User
  }

  type Mutation {
   login(email: String!, password: String!): Auth
   addUser(username: String!, email: String!, password: String!): Auth
   saveBook(authors: [String!], description: String!, title: String!, bookId: ID!, image: String!, link: String!): User
   removeBook(bookId:String!): User
  }
`;

module.exports = typeDefs;
