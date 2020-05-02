import mongoose from "mongoose";

const schema = new mongoose.Schema({user_id: String, username: String, email: String, password: String});

const user = mongoose.model("user", schema);

export const User = user;