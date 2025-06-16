import mongoose from "mongoose";

const cartItemSchem = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        addedAt: { type: Date, default: Date.now }
    }],
},{
    timestamps: true
})

export default mongoose.model("CartItem", cartItemSchem);