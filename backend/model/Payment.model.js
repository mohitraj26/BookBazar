import mongoose, {Schema} from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, required: true },
    paymentGateway: { type: String, required: true },
    transactionId: String,
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    gatewayResponse: Object,
},{
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment