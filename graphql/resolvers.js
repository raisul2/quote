import mongoose from "mongoose";
import { quotes, users } from "../fakedata";
const User = mongoose.model("User");
const Quote = mongoose.model("Quote");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const resolvers = {
  Query: {
    users: async () => await User.find({}),
    user: async (_, { _id }) => await User.findOne({ _id }),
    quotes: async () => await Quote.find({}).populate("by", "_id firstName"),
    iquote: async (_, { by }) => await Quote.find({ by }),
    myprofile: async (_, args, { userId }) => {
      if (!userId)throw new Error("You must be logged in");
  
      return await User.findOne({ _id: userId });
    },
  },
  User: {
    quotes: async ({ _id }) => Quote.find({ by: _id }),
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const { email, password } = userNew;
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User already existes with that email");
      }
      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        ...userNew,
        password: hashPassword,
      });

      return await newUser.save();
    },

    signinUser: async (_, { userSignin }) => {
      const { email, password } = userSignin;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User doesnot exists with that email");
      }
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        throw new Error("email or password in invalid");
      }
      const token = jwt.sign({ userId: user._id }, process.env.SEC_KEY);
      return { token };
    },

    createQuote: async (_, { name }, { userId }) => {
      if (!userId) {
        throw new Error("You must be logged in");
      }
      const newQuote = new Quote({
        name,
        by: userId,
      });

      await newQuote.save();

      return "Quote saved successfully";

      //    const user = await User.findOne({})
    },
  },
};
