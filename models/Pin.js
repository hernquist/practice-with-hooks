const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    createdAt: String,
    title: String,
    content: String,
    image: String,
    latitude: Nunmber,
    longitude: Nunber,
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: { type: mongoose.Schema.ObjectId, ref: "User" }
      }
    ]
  },
  { timestamps: true }
);

mongoose.model("Pin", PinSchema);
