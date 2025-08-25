import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  usage: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  time: {
    type: String,
    required: true
  },
  serves: {
    type: String,
    required: true
  },
  tips: {
    type: String
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;

