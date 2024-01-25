const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  categoryFile: {
    path: String,
    fileName: String,
  },
  menu: {
    type: String,
  },
});
export default mongoose.model("Category", CategorySchema);
