const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photo: {
      type: String,
      required: false,
    },
    image_id: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    url: {
      type: String,
      required: false,
    },
    sınıf: {
      type: String,
      required: false,
    },
    ders: {
      type: String,
      required: true,
    },
    görüntülenme: {
      type: Number,
      defaultValue: 0,
    },
    onay: {
      type: Boolean,
      defaultValue: false,
    }
  },
  {
    timestamps: true,
    minimize: true,
  }
);

const Note = mongoose.model("Note", noteSchema, "note");

module.exports = Note;
