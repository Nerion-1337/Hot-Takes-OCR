const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      unique: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024,
    },
  },
  { timestamps: true }
);

  module.exports = mongoose.model("user", userSchema);