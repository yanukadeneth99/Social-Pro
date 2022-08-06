const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
    },
    // Object ID of the Like Object
    likeable: {
      type: Schema.ObjectId,
      required: true,
      refPath: "onModel",
    },
    // Defining the type of the liked object dynamically
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = model("Like", likeSchema);

module.exports = Like;
