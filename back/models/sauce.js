const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50,
    unique: true,
    lowercase: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    required: true,
    min: 2,
    max: 1024,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    min: 2,
    max: 4000,
    lowercase: true,
    trim: true,
  },
 
  mainPepper: {
    type: String,
    required: true,
    min: 2,
    max: 1024,
    lowercase: true,
    trim: true,
  }, 
  imageUrl: {
    type: String,
    required: true,
  },
  heat: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
  },
  dislikes: {
    type: Number,
    required: false,
    default: 0,
  },
  usersLiked: {
    type: [String],
    required: false,
  },
  usersDisliked: {
    type: [String],
    required: false,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("sauce", sauceSchema);
