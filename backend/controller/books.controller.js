import Book from "../model/Book.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const addBooks = async(req, res) => {
    try {
        const {title, author, isbn, publisher, publicationYear, genre, description, price, stockQuantity, coverImageUrl} = req.body;

        const book = await Book.create({
            title,
            author,
            isbn,
            publisher,
            publicationYear,
            genre,
            description,
            price,
            stockQuantity,
            coverImageUrl
        })
        res.status(201).json({
            success: true,
            book
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllBooks = async(req, res) =>{
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            count: books.length,
            books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message,
        });
    }
}

const getBooksById = async(req, res) =>{
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch book",
            error: error.message,
        });   
    }
}

const updateBook = async(req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error.message,
        });
    }
}

const deleteBook = async(req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error.message,
        });
    }
}

export {addBooks, getAllBooks, getBooksById, updateBook, deleteBook}



