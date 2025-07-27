const { model, Schema, models } = require("../connection");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    image: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Dinning",
        "Pots",
        "Jugs",
        "Mugs",
        "Plates",
        "Home Decor",
        "Vases",
        "Others",
      ],
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      set: (val) => Math.round(val * 10) / 10,
    },
  },
  { timestamps: true }
);

module.exports = models.products || model("products", productSchema);