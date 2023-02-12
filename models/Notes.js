const mongo = require("mongoose");
const { Schema } = mongo;

const NotesSchema = new Schema({
  user: {
    type: mongo.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongo.model("notes", NotesSchema);
