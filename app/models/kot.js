import mongoose, { Schema } from "mongoose";

class KotSchema extends Schema {
  constructor() {
    const productsSchema = new Schema({
      productId: { type: String, ref: "Product" },
      variant: String,
      amount: { type: Number, default: 0 },
      quantity: Number,
      totalAmount: { type: Number, default: 0 },
      discount: { type: Number, default: 0 }, // discount on total amount
      taxableAmount: { type: Number, default: 0 }, // taxable amount after less discount in total amount
      cgstAmount: { type: Number, default: 0 }, // gst amount on taxable amount
      sgstAmount: { type: Number, default: 0 }, // gst amount on taxable amount
      netAmount: { type: Number, default: 0 }, // amount after less discount and add gst
      gst: { type: Boolean, default: false },
      coupon: { type: Boolean, default: false },
      serviceTax: { type: Boolean, default: false },
      status: { type: String, default: "Pending" },
      code: { type: String },
      price: Number,
      variant: String,
      productFile: {
        path: String,
        fileName: String,
      },
      name: String,
    });
    const obj = super({
      date: Date,
      time: Date,
      tableNo: String,
      products: [productsSchema],
      kotNo: Number,
      orderId: { type: String, ref: "order" },
      status: { type: String, default: "Pending" }, // after order complete status "done"
    });
    return obj;
  }
}

export default mongoose.model("kot", new KotSchema());
