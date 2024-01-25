import Kot from "../models/kot";
import _ from "lodash";
import moment from "moment";
import {successObj, errorObj} from "../../config/settings";
import async from "async";
import {taxObj} from "./_utils";
import OrderCtrl from "../controllers/order";
import {TableFilterQuery} from "sz-node-utils/dist/utils/table";

let initKot = 1;
const exp = {
  nextKotNo: () => {
    return new Promise((resolve) => {
      Kot.findOne({
        $and: [
          {date: {$gte: moment().startOf("day")._d}},
          {date: {$lte: moment().endOf("day")._d}},
        ],
      })
        .sort({kotNo: -1})
        .exec((err, result) => {
          if (result) {
            resolve({...successObj, kotNo: result.kotNo + 1});
          } else {
            resolve({...successObj, kotNo: initKot});
          }
        });
    });
  },
  addKot: (data, socket) => {
    return new Promise(async (resolve) => {
      let newKot = new Kot();
      let {kotNo} = await exp.nextKotNo();
      _.each(data, (item, key) => {
        newKot[key] = item;
      });
      newKot.orderId = data.orderId;
      newKot.kotNo = kotNo;
      newKot.date = moment();
      newKot.time = Date.now();
      newKot.status = "Pending";
      newKot.save((err, result) => {
        if (result) {
          OrderCtrl.updateOrderDetails(data).then((resp) => {
            exp.broadcastKot(socket, result);
            resolve({...successObj, message: "KOT added successfully."});
          });
        } else {
          resolve({...errorObj, message: "KOT not added, please try again."});
        }
      });
    });
  },
  calculateAmount: (data) => {
    return new Promise((resolve, reject) => {
      let respObj = {
        discount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        serviceTaxAmount: 0,
        totalAmount: 0,
        kotId: [],
      };
      // let gstTax = taxObj.gst;
      Kot.find({orderId: data.orderId}).exec((err, result) => {
        async.each(
          result,
          (eachKot, cb) => {
            respObj.kotId.push(eachKot._id);
            async.each(
              eachKot.products,
              (item, cb1) => {
                // let discount = 0;
                /*if (item.coupon && data.discountPer) {
                  discount = (item.totalAmount * data.discountPer) / 100;
                  if (discount) {
                    discount = parseFloat(discount.toFixed(2));
                  }
                }
                item.discount = discount;
                item.taxableAmount = item.totalAmount - discount;*/
                /* if (item.gst) {
                   let gstAmount = (item.taxableAmount * gstTax) / 100;
                   if (gstAmount) {
                     let cgstAmount = gstAmount / 2;
                     cgstAmount = parseFloat(cgstAmount.toFixed(2));
                     item.cgstAmount = cgstAmount;
                     item.sgstAmount = cgstAmount;
                   }
                 } else {
                   item.cgstAmount = 0;
                   item.sgstAmount = 0;
                 }*/
                // item.netAmount =
                //   item.taxableAmount + item.cgstAmount + item.sgstAmount;

                /* respObj.discount =
                   parseFloat(respObj.discount) + parseFloat(item.discount);
                 respObj.cgstAmount =
                   parseFloat(respObj.cgstAmount) + parseFloat(item.cgstAmount);
                 respObj.sgstAmount =
                   parseFloat(respObj.sgstAmount) + parseFloat(item.sgstAmount);
                 respObj.totalAmount =
                   parseFloat(respObj.totalAmount) + parseFloat(item.netAmount);*/

                cb1();
              },
              () => {
                /* eachKot.save((err, result) => {
                   console.log(err, result);
                   cb();
                 });*/
                cb()
              }
            );
          },
          () => {
            resolve({...successObj, data: respObj});
          }
        );
      });
    });
  },
  updateStatus: (data, socket) => {
    return new Promise((resolve) => {
      Kot.findOne({_id: data.kotId}).exec((err, result) => {
        if (result) {
          if (data.productId) {
            let findPro = _.find(result.products, (item) => {
              return item._id == data.productId;
            });
            if (findPro) {
              findPro.status = "Done";
              let findPending = _.find(result.products, (item) => {
                return item.status == "Pending";
              });
              if (!findPending) {
                result.status = "Done";
              }
            }
            result.save((err, doc) => {
              if (!err && doc) {
                if (doc.status == 'Done') {
                  exp.broadcastKot(socket, doc);
                }
                resolve({
                  ...successObj,
                  message: "KOT Status updated successfully.",
                });
              } else {
                resolve({
                  ...errorObj,
                  message: "KOT Status not updated, please try again. 55",
                });
              }
            });
          } else {
            _.find(result.products, (item) => {
              item.status = "Done";
            });
            result.status = "Done";
            result.save((err, doc) => {
              if (!err && doc) {
                if (doc.status == 'Done') {
                  exp.broadcastKot(socket, doc);
                }
                resolve({
                  ...successObj,
                  message: "KOT Status updated successfully.",
                });
              } else {
                resolve({
                  ...errorObj,
                  message: "KOT Status not updated, please try again. 66  ",
                });
              }
            });
          }
        } else {
          resolve({...errorObj, message: "KOT not found, please try again."});
        }
      });
    });
  },
  broadcastKot: (io, data) => {
    exp.singleKot(data._id).then((resp) => {
      io.emit('refresh kot', resp.data)
    })
  },
  pendingKot: () => {
    return new Promise((resolve) => {
      Kot.find({
        $and: [
          {status: "Pending"},
          {date: {$gte: moment().startOf("day")._d}},
          {date: {$lte: moment().endOf("day")._d}}
        ],
      }).populate({path: "products.productId", select: "name code vegNonVeg"}).sort({_id: -1}).exec((err, result) => {
        resolve({...successObj, data: result})
      })
    })
  },
  singleKot: (kotId) => {
    return new Promise((resolve) => {
      Kot.findOne({_id: kotId}).populate({
        path: "products.productId",
        select: "name code vegNonVeg"
      }).sort({_id: -1}).exec((err, result) => {
        resolve({...successObj, data: result})
      })
    })
  },

  findAllKot: async (query) => {
    try {
      const data = await TableFilterQuery(Kot, {...query});
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
