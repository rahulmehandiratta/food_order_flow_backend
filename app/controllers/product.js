import {TableFilterQuery} from "sz-node-utils/dist/utils/table";
import {errorObj, successObj} from "../../config/settings";
import Product from "../models/product";
import _ from "lodash";
import Category from "../models/category"
import async from "async"

const product = {
  create: async (body) => {
    try {
      const product = new Product();
      _.each(body, (item, key) => {
        product[key] = item;
      });

      const NameCheck = await Product.findOne({
        code: body.code,
      });

      if (NameCheck) {
        return {
          ...errorObj,
          message: "Product Code must be unique.",
        };
      }

      const savedProduct = await product.save();

      return {
        ...successObj,
        savedProduct,
        message: "Product added successfully",
      };
    } catch (error) {
      console.log(error, "error");
      return {...errorObj, message: "Failed to create Product record"};
    }
  },

  ProductList: async (query) => {
    try {
      let populateArr = [
        { path: "categoryId", select: "name" },
      ];
      const data = await TableFilterQuery(Product, {...query,populateArr});
      return data;
    } catch (err) {
      console.error(err);
      return {
        ...errorObj,
        message: "Error fetching sale list",
      };
    }
  },
  groupedProduct: () => {
    return new Promise((resolve) => {
      Product.aggregate([
        {$group: {_id: "$categoryId", product: {$push: "$$ROOT"}}}
      ]).exec((err, docs) => {
        Category.find({}).lean().exec((err, result) => {
          async.eachLimit(result, 1, (item, cb) => {
            let findPro = _.find(docs, (proItem) => {
              return proItem._id && proItem._id.toString() == item._id.toString()
            })
            if (findPro) {
              item.product = findPro.product;
              cb()
            } else {
              cb()
            }
          }, () => {
            resolve({...successObj, data: result})
          })
        })
      })
    })
  }

};

export default product;
