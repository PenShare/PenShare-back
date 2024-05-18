import mongoose from "mongoose";
const { Schema } = mongoose;

const noteSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    url: {
        type: String,
        required: true
    },
    not_bilgi: {
        type: String,
        required: true

    },
},
    {
        timeseries: true,
        minimize: true,
    }
);

const Note = mongoose.model("Note", noteSchema, "note");

export default Note;