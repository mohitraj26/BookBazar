import mongoose, { Schema } from "mongoose";

const APIKeysSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    permissions: [{ type: String, enum: ['read', 'write', 'delete'] }],
    expiresAt: Date,
    lastUsed: Date,
    isActive: { type: Boolean, default: true }

},{
    timestamps: true
});

const APIKeys =  mongoose.model("APIKeys", APIKeysSchema);
export default APIKeys