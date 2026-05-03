import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    amount: Number,
    tax: Number,
    total: Number,

    address: {
      fullName: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      phoneNumber: String,
    },
      cancelReason: {
    type: String,
    default: "",
      },

      cancelledAt: {
        type: Date,
         },
      status: {
        type: String,
        default: "Pending",
      },

    paymentMethod: String,
    paymentStatus: String,
    isPaid: Boolean,
  },

  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);