import { TableFilterQuery } from "sz-node-utils/dist/utils/table";
import { errorObj, successObj } from "../../config/settings";
import Customer from "../models/customer";
import _ from "lodash";
import async from "async";

const customer = {
  create: async (body) => {
    try {
      const user = new Customer();
      _.each(body, (item, key) => {
        user[key] = item;
      });

      const saveduser = await user.save();

      return {
        ...successObj,
        saveduser,
        message: "Customer added successfully",
      };
    } catch (error) {
      console.log(error, "error");
      return { ...errorObj, message: "Failed to create Customer record" };
    }
  },

  CustomerList: async (query) => {
    try {
      const data = await TableFilterQuery(Customer, { ...query });
      return data;
    } catch (err) {
      console.error(err);
      return {
        ...errorObj,
        message: "Error fetching customer list",
      };
    }
  },
  updateCustomer: async (body) => {
    try {
      const result = await Customer.findOne({ _id: body._id }).exec();

      _.each(body, (item, key) => {
        result[key] = item;
      });

      const updateCustomer = await result.save();

      if (updateCustomer) {
        return {
          ...successObj,
          message: "Customer updated successfully.",
        };
      }
    } catch (err) {
      return {
        ...errorObj,
        message: "An error occurred while updating Customer ",
      };
    }
  },

  getSingleCustomer: (data) => {
    return new Promise((resolve, reject) => {
      Customer.findOne({ _id: data._id }).exec((err, doc) => {
        if (doc) {
          resolve({
            ...successObj,
            data: doc,
          });
        } else {
          resolve({
            ...errorObj,
            data: null,
          });
        }
      });
    });
  },
  deleteCustomer: async (data) => {
    try {
      const deleteCustomers = await Customer.findByIdAndDelete({
        _id: data._id,
      });
      if (deleteCustomers) {
        return {
          message: "Customer deleted successfully.",
        };
      }
    } catch (err) {
      return {
        ...errorObj,
        message: "An error occurred while deleting the Customer.",
      };
    }
  },
};

export default customer;
