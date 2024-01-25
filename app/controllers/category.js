import {errorObj, successObj} from "../../config/settings";
import Category from "../models/category";
import _ from "lodash";
import {TableFilterQuery} from "sz-node-utils/dist/utils/table";

const category = {
  create: async (body) => {
    try {
      const newCategory = new Category();

      _.each(body, (item, key) => {
        newCategory[key] = item;
      });

      const NameCheck = await Category.findOne({
        name: body.name,
        menu: body.menu
      });

      if (NameCheck) {
        return {
          ...errorObj,
          message: "Category Name Must Be Unique.",
        };
      }

      const savedCategory = await newCategory.save();

      return {
        ...successObj,
        savedCategory,
        message: "Category Details Saved Successfully",
      };
    } catch (error) {
      console.log(error, "error");
      return {...errorObj, message: "Failed To Create Category Record"};
    }
  },

  findAllCategory: async (query) => {
    try {
      const data = await TableFilterQuery(Category, {...query});
      return data;
    } catch (err) {
      return {
        ...errorObj,
        message: "Error fetching category list",
      };
    }
  },

};

export default category;
