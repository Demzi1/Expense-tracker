export const TransactionTypeDefs = `#graphql
    type Transaction{
        _id:ID!
        userId: ID!
        description:String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String!
        date: String!
        user:User!
    }

    type CategoryStatistics{
        category: String!
        totalAmount: Float!
    }

    type Query{
        transaction(transactionId:ID!):Transaction!
        transactions:[Transaction!]
        categoryStatistics:[CategoryStatistics!]
    }

    type Mutation{
        createTransaction(input: createTransactionInput!):Transaction!
        deleteTransaction(transactionId: ID!): Transaction
        updateTransaction(input: updateTransactionInput!):Transaction!
    }

    input createTransactionInput{
        description:String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String!
        date: String!
    }

    input updateTransactionInput{
        transactionId:ID!
        description:String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String!
        date: String!
    }

`
   