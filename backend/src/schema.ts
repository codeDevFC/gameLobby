import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Game {
    id: ID!
    title: String!
    description: String!
    category: String!
    rating: Float!
    plays: Int!
    imageUrl: String!
    provider: String!
    isLive: Boolean!
    features: [String]!
    jackpot: String
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Query {
    games: [Game!]!
    game(id: ID!): Game
    featuredGames(limit: Int): [Game!]!
    users: [User!]!
  }

  type Mutation {
    incrementGamePlays(id: ID!): Game
  }
`;
