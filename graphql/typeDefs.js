import { gql } from "apollo-server";
export const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    quotes: [Quote]
  }



  type Quote {
    name: String!
    by: ID!
  }

  type Query {
    users: [User]
    user(_id: ID!): User!
    quotes: [QuoteWithName]
    iquote(by: ID!): [Quote]
    myprofile:User 
  }

  type QuoteWithName{
    name: String!
    by:IdName 
}

type IdName {
    _id: String!
    firstName:String!
}
 type Token{
     token:String
 }
  type Mutation {
    signupUser(userNew:UserInput!): User
    signinUser(userSignin:UserSignInput!):Token
    createQuote(name:String!):String
  }

  input UserInput{
    firstName: String!
      lastName: String!
      email: String!
      password: String!
  }

  input UserSignInput{
      email: String!
      password: String!
      
  }
`;
