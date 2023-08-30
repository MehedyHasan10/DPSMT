const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 5 characters long"],
    },

    slug: {
      type: String,
      required: [true, "Slug name is required"],
      lowercase: true,
      unique: true,
    },
  },

  { timestamps: true }
);

const Category = model("Category", categorySchema);
module.exports = Category;
