import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
    mutation createTransaction($input: createTransactionInput!){
        createTransaction(input : $input){
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`

export const UPDATE_TRANSACTION = gql`
    mutation updateTransaction($input: updateTransactionInput!){
        updateTransaction(input: $input){
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`

export const DELETE_TRANSACTION = gql`
    mutation deleteTransaction($transactionId: ID!){
        deleteTransaction(transactionId: $transactionId){
            _id
        }
    }
`