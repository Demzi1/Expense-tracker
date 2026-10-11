import { gql } from "@apollo/client"

export const GET_TRANSACTION = gql`
    query getTrasaction($transactionId: ID!){
        transaction(transactionId: $transactionId){
            _id
            description
            paymentType
            category
            amount
            location
            date
            user{
                _id
                name
                username
                profilePicture
            }
        }
    }
`

export const GET_TRANSACTIONS = gql`
    query getTransactions{
        transactions{
            _id
            userId
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`
export const GET_CATEGORY_STATS = gql`
    query getCategoryStatistics{
        categoryStatistics{
            category
            totalAmount
        }
    }
`

