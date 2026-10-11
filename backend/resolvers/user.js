import Transaction from "../models/transaction.js";
import User from "../models/user.js"
import bcrypt from "bcryptjs"
export const userResolver = {
    Mutation:{
      signUp: async(_,{input},context)=>{
        try {
          const {username, name, password, gender} = input;

          if(!username || !name || !password || !gender){
              throw new Error ("All fields are required");
          }

          const existingUser = await User.findOne({username});

          if(existingUser){
            throw new Error ("User already exists")
          }

          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password, salt);
          const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
          const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
          const newUser = new User({username, name, password: hashedPassword, gender, profilePicture: gender == "male"? boyProfilePic : girlProfilePic});
          await newUser.save();
          await context.login(newUser);
          return newUser;
        } catch (err) {
          console.log("error in signup:", err)
          throw new Error (err.message || "Internal server error");
        }
        
      },
      login: async(_,{input},context)=>{
        try {
          const {username,password} = input;
          if(!username || !password) throw new Error("All fields are required");
          const {user} = await context.authenticate("graphql-local", {username, password})
          await context.login(user);
        } catch (err) {
          console.log("error in login:", err)
          throw new Error (err.message || "Internal server error");
        }
      },
      logout:  async(_,__,context)=>{
        try {
          await context.logout();
          context.req.session.destroy((err)=>{
            if(err){
              throw err;
            }
          })
          context.res.clearCookie("connect.sid")
 
          return { message: "Logged out successfully"}
        } catch (err) {
          console.log("error in logout:", err)
          throw new Error (err.message || "Internal server error");
        }
      }
    },
    Query:{
     authUser: async(_,__,context)=>{
      try {
        const user = context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
     },
     user: async(_,{userId})=>{
        try {
          const user = await User.findById(userId);
          return user;
        } catch (err) {
          console.error("Error user query: ", err);
          throw new Error(err.message || "Error getting user");
        }
     }
   },  
   User:{
    transactions: async(parent)=>{
      try {
        const transactions = await Transaction.find({userId: parent._id});
        return transactions;
      } catch (err) {
        console.log("Error in user resolver", err.message);
        throw new Error(err.message || "Internal server error")
      }
    }
   }
}