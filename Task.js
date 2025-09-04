import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The task name is needed"],
    trim: true,
    maxLength: [100, "The name must have less than 100 characters"],
  },

  description: {
    type: String,
    default: "",
    trim: true,
    maxLength: [500, "The name must have less than 500 characters"],
  },

  color: {
    type: Number,
    min: [0, "The color index can't be less than 0"],
    max: [5, "The color index can't be higher than 0"],
  },

  favorite: {
    type: Boolean,
    default: false,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    default: null,
  },

  complete: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Task", TaskSchema);
