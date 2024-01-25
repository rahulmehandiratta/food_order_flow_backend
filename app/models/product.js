import mongoose, {ObjectId, Schema} from 'mongoose';

class ProductSchema extends Schema {
  constructor() {
    const product = super({
      name: {type: String},
      categoryId: {type: String , ref:"Category"},
      code: {type: String},
      price: Number,
      gst: Boolean,
      coupon: Boolean,
      vegNonVeg: String,
      productFile: {
        path: String,
        fileName: String,
      },
      variants: [
        {
          variantId: String,
          name: String,
          price: String,
        },
      ],
    });
    return product;
  }
}

export default mongoose.model('Product', new ProductSchema());
