import Book from "../model/Book.model.js";
import Review from "../model/Review.model.js";

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

const addReview = async(req, res) => {
    try {
        const { rating, comment, title } = req.body;
        const userId = req.user.id;
        const bookId = req.params.id;

        if (!bookId) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // Optional: Prevent duplicate review
        const alreadyReviewed = await Review.findOne({ bookId, userId });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this book",
            });
        }

        const newReview = new Review({
            bookId,
            userId,
            rating,
            title,
            comment,
        });

        await newReview.save();

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: error.message,
        })
    }
}

const getReviews = async(req, res) =>{
    try {
        const reviews = await Review.find({ bookId: req.params.id });
        res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
}

const deleteReview = async(req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message,
        })
    }
}

export {addBooks, getAllBooks, getBooksById, updateBook, deleteBook, addReview, getReviews, deleteReview}



