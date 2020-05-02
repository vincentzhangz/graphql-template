import {gql} from "apollo-server-express";

export const schema = gql`
    type Query {
        users: [User]
    }

    type User {
        id: ID
        user_id: String
        username: String
        email: String
        password: String
    }

    type LoginResponse {
        user: User!
        token: String!
    }

    type Mutation {
        createUser(username: String!, email:String!, password:String!): User!
        login(email:String!, password:String!): LoginResponse!
    }
`;