import mongoose, {Schema} from 'mongoose'

class orderSchema extends Schema {
  constructor() {
    const obj = super({
      customerId: {type: String, ref: "customer"},
      customerMobileNo: String,
      date: Date,
      time: Date,
      tableNo: String,
      subTotal: Number,
      discountPer: Number,
      discount: Number,
      cgstAmount: Number,
      sgstAmount: Number,
      totalAmount: Number, // total amount after less discount and plus gst amount
      serviceTaxAmount: Number,
      netAmount: Number,
      tip: Number,
      settleAmount: Number,
      couponId: {type: String},
      kotId: [{type: String, ref: "kot"}],
      status: {type: String, default: "Pending"},
      orderNo: Number,
      payments: {},
      tax: Number,
    })
    return obj
  }
}

export default mongoose.model('order', new orderSchema)
