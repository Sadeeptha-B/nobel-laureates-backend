import { Schema, model } from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

export interface IUser {
  name: string;
  password: string;
  email: string;
}

// Not storing the user comments under the user schema for simplicity since the frontend app
// does not query comments by user
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

userSchema.plugin(uniqueValidator);
const User = model("User", userSchema);

export { User };
