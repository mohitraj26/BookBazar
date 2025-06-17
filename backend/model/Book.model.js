import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publisher: String,
  publicationYear: Number,
  genre: [{ type: String }],
  description: String,
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  coverImageUrl: String,
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
},{
    timestamps: true
});

const Book = mongoose.model("Book", bookSchema);
export default Book;