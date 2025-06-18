import express from "express";
import { addBooks, addReview, deleteBook, deleteReview, getAllBooks, getBooksById, getReviews, updateBook } from "../controller/books.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const bookRoutes = express.Router();

bookRoutes.post("/add-books", protect, isAdmin, addBooks);
bookRoutes.get("/get-books", getAllBooks);
bookRoutes.get("/get-book/:id", getBooksById);
bookRoutes.put("/update-book/:id", protect, isAdmin, updateBook);
bookRoutes.delete("/delete-book/:id", protect, isAdmin, deleteBook);

bookRoutes.post("/:id/add-reviews", protect, addReview);
bookRoutes.get("/:id/get-reviews", getReviews);
bookRoutes.delete("/delete-reviews/:id", protect, isAdmin, deleteReview);

export default bookRoutes;