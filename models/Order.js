import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    address: { type: String },
    mobile: { type: String },
    cart: { type: Array },
    total: { type: Number },
    paymentId: { type: String },
    paymentMethod: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    verifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;
