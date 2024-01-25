import Order from "../models/order";
import _ from "lodash";
import async from "async";
import { successObj, errorObj } from "../../config/settings";
import moment from "moment";
import KotCtrl from "../controllers/kot";
import { TableFilterQuery } from "sz-node-utils/dist/utils/table";

const exp = {
  nextOrderNo: () => {
    return new Promise((resolve) => {
      Order.findOne({})
        .sort({ orderNo: -1 })
        .exec((err, result) => {
          if (result) {
            resolve({ ...successObj, orderNo: result.orderNo + 1 });
          } else {
            resolve({ ...successObj, orderNo: 1 });
          }
        });
    });
  },
  addOrder: (data, socket) => {
    return new Promise(async (resolve) => {
      Order.findOne({ tableNo: data.tableNo, status: "Pending" }).exec(
        async (err, result) => {
          if (result) {
            KotCtrl.addKot({ ...data, orderId: result._id }, socket).then(
              (resp) => {
                resolve(resp);
              }
            );
          } else {
            let newOrder = new Order();
            let { orderNo } = await exp.nextOrderNo();
            _.each(data, (item, key) => {
              newOrder[key] = item;
            });
            newOrder.orderNo = orderNo;
            newOrder.date = moment();
            newOrder.time = Date.now();
            newOrder.save(async (err, result) => {
              if (!err && result) {
                KotCtrl.addKot({ ...data, orderId: result._id }, socket).then(
                  (resp) => {
                    resolve(resp);
                  }
                );
              } else {
                resolve({
                  ...errorObj,
                  message: "Order not generate, please try again.",
                });
              }
            });
          }
        }
      );
    });
  },
  updateOrderDetails: (orderData) => {
    return new Promise((resolve) => {
      Order.findOne({ _id: orderData.orderId }).exec((err, result) => {
        if (result) {
          KotCtrl.calculateAmount({
            ...result,
            orderId: orderData.orderId,
          }).then((resp) => {
            let { data } = resp;

            /* result.discount = data.discount ? data.discount : 0;
            result.cgstAmount = data.cgstAmount ? data.cgstAmount : 0;
            result.sgstAmount = data.sgstAmount ? data.sgstAmount : 0;
            result.totalAmount = data.totalAmount ? data.totalAmount : 0;*/
            result.totalAmount = orderData.totalAmount;
            result.cgstAmount = orderData.cgstAmount;
            result.sgstAmount = orderData.sgstAmount;
            result.netAmount = orderData.netAmount;
            result.serviceTaxAmount = orderData.serviceTaxAmount;
            result.tax = orderData.tax;
            if (!result.kotId) {
              result.kotId = [];
            }
            result.kotId = data.kotId;
            result.save((err, result1) => {
              if (!err && result1) {
                resolve({
                  ...successObj,
                  message: "Order updated successfully.",
                });
              } else {
                resolve({
                  ...errorObj,
                  message: "Order not updated, please try again.",
                });
              }
            });
          });
        } else {
          resolve({
            ...errorObj,
            message: "Order not found, please try again.",
          });
        }
      });
    });
  },

  saveOrder: (orderData) => {

    return new Promise((resolve) => {
      Order.findOne({ _id: orderData.orderId }).exec((err, result) => {
        if (result) {
          KotCtrl.calculateAmount({
            ...result,
            orderId: orderData.orderId,
          }).then((resp) => {
            let { data } = resp;
            result.totalAmount = orderData.totalAmount;
            result.cgstAmount = orderData.cgstAmount;
            result.sgstAmount = orderData.sgstAmount;
            result.netAmount = orderData.netAmount;
            result.serviceTaxAmount = orderData.serviceTaxAmount;
            result.tax = orderData.tax;
            result.status = "Done"
            if (!result.kotId) {
              result.kotId = [];
            }
            result.kotId = data.kotId;
            result.save((err, result1) => {
              if (!err && result1) {
                resolve({
                  ...successObj,
                  message: "Order update and saved successfully.",
                });
              } else {
                resolve({
                  ...errorObj,
                  message: "Order not saved, please try again.",
                });
              }
            });
          });
        } else {
          resolve({
            ...errorObj,
            message: "Order not found, please try again.",
          });
        }
      });
    });
  },

  oldKot: async (data) => {
    return new Promise(async (resolve) => {
      Order.findOne({ tableNo: data.tableNo, status: "Pending" }).exec(
        async (err, result) => {
          if (result) {
            const oldKot = await KotCtrl.findAllKot({ orderId: result._id });
            if (oldKot) {
              resolve({
                ...successObj,
                data: oldKot,
                netAmount: result.netAmount,
                totalAmount: result.totalAmount,
                message: "Old Kot added successfully",
              });
            } else {
              resolve({
                ...errorObj,
                message: "Order not found, please try again.",
              });
            }
          } else {
            resolve({
              ...errorObj,
              message: "Order not found, please try again.",
            });
          }
        }
      );
    });
  },

  getPendingOrderTables: () => {
    return new Promise((resolve) => {
      Order.find(
        {
          $and: [
            { date: { $gte: moment().startOf("day")._d } },
            { date: { $lte: moment().endOf("day")._d } },
            { status: "Pending" },
          ],
        },
        { tableNo: 1, netAmount: 1, totalAmount: 1 }
      ).exec((err, result) => {
        resolve({ ...successObj, data: result });
      });
    });
  },

  findAllOrders: async (query) => {
    try {
      const data = await TableFilterQuery(Order, {...query});
      return data
    } catch (err) {
      console.error(err);
      return {
        ...errorObj,
        message: "Error fetching Kot list",
      };
    }
  },
  
};
export default exp;
