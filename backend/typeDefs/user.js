export const userTypeDef = `#graphql

type User{
    _id: ID!
    username: String!
    email: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
    transactions: [Transaction!]
}

type Query{
    user(userId:ID!):User
    authUser: User
}

input SignUpInput{
    name: String!
    username: String!
    password: String!
    gender: String!
}


input LoginInput{
    username: String!
    password: String!
}

type LogoutResponse{
    message: String!
}

type Mutation{
    signUp(input: SignUpInput!):User
    login(input: LoginInput!):User
    logout: LogoutResponse
}

`