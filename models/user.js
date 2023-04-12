const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true, maxLength: 40},
  password: {type: String, required: true},
  salt: { type: String, required: true },
  email: {type: String},
  liked_recipes: [{type: Schema.Types.ObjectId, ref:"Recipe"}],
  created_recipes: [{ type: Schema.Types.ObjectId, ref:"Recipe"}]
})

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);