import { errorObj, successObj } from "../../config/settings";
import Variants from "../models/Variants";
import _ from "lodash";

const variant = {
  create: async (body) => {
    try {
      const variant = new Variants();

      _.each(body, (item, key) => {
        variant[key] = item;
      });

      const NameCheck = await Variants.findOne({
        name: body.name,
      });

      if (NameCheck) {
        return {
          ...errorObj,
          message: "Variants Name Must Be Unique.",
        };
      }

      const saveVariant = await variant.save();

      return {
        ...successObj,
        saveVariant,
        message: "Variants Details Saved Successfully",
      };
    } catch (error) {
      console.log(error, "error");
      return { ...errorObj, message: "Failed To Create Variants Record" };
    }
  },

  getVariant: async (query) => {
    try {
      const data = await Variants.find(query).populate([
        {
          path: 'category',
          select: 'name',
        },
      ])
      return { data };
    } catch (err) {
      return {
        ...errorObj,
        message: "Error Fetching Variants List",
      };
    }
  },

};

export default variant;
