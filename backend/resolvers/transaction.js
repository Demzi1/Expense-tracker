import Transaction from "../models/transaction.js";
import User from "../models/user.js";

export const transactionResolver ={
    Query:{
        transactions: async(_,__,context)=>{
            try {
                if(!context.getUser()) throw new Error("Unauthorised");
                const userId = await context.getUser()._id;
                const transactions = Transaction.find({userId});
                return transactions;
            } catch (err) {
                console.error("Error getting transactions", err)
                throw new Error("Error getting transactions");
            }
        },
        transaction: async(_,{transactionId},)=>{
            try {
                const transaction = Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                console.error("Error getting transaction", err)
                throw new Error("Error getting transaction");
            }
        },
        categoryStatistics: async(_,__,context)=>{
            try {
                if(!context.getUser()) throw new Error("Unauthorised");
                const userId = context.getUser()._id;
                const transactions = await Transaction.find({userId});
                const categoryMap = {};
                transactions.forEach((transaction)=>{
                    if(!categoryMap[transaction.category]){
                        categoryMap[transaction.category] = 0
                    }
                    categoryMap[transaction.category] += transaction.amount;
                })
                return Object.entries(categoryMap).map(([category, totalAmount])=>({category, totalAmount}))
                
            } catch (err) {
                console.log("Error get category statistics", err.message);
                throw new Error("Error getting category statistics");
            }
        }
    },
    Mutation:{
        createTransaction: async(_,{input},context)=>{
           try {
            if(!context.getUser()) throw new Error("Unauthorised");
            const userId = await context.getUser()._id;
            const newTransaction = new Transaction({userId, ...input })
            await newTransaction.save();
            return newTransaction;
           } catch (err) {
            console.error("Error creating transaction", err)
            throw new Error("Error creating transaction");
           }
        },
        updateTransaction: async(_,{input},)=>{
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new:true});
                return updatedTransaction;
            } catch (error) {
                console.error("Error updating transaction", err)
                throw new Error("Error updating transaction");
            }
        }, 
        deleteTransaction: async(_,{transactionId},)=>{
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                console.error("Error deletting transaction", err)
                throw new Error("Error deletting transaction");
            }
        }

    },
    Transaction:{
        user:async(parent)=>{
            try {
                const user = await User.findById(parent.userId);
                return user;
            } catch (err) {
                console.log("Error getting user");
                throw new Error("Error getting user")
            }

        }
    }
}
