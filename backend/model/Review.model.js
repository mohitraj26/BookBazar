import mongoose ,{ Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
},{
    timestamps: true
})

const Review = mongoose.model("Review", reviewSchema);

export default Review