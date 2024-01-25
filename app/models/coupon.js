import mongoose, {Schema} from 'mongoose'

class couponSchema extends Schema {
  constructor() {
    const obj = super({
      couponNo: Number,
      coupon: String,
      mobileNo: String,
      discount: {type: Number, default: 0},
      active: {type: Boolean, default: true}
    })
    return obj
  }
}

export default mongoose.model('coupon', new couponSchema)
