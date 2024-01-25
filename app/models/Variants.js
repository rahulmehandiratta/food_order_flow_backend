const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  category: [{type: String, ref: 'Category'}],
  categoryType: String

});
export default mongoose.model("Variant", VariantSchema);