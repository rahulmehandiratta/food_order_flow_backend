import TableJson from "../jsons/table.json"
import async from "async"
import {successObj} from "../../config/settings";
import OrderCtrl from "../controllers/order"
import _ from "lodash"

const exp = {
  tableList: () => {
    return new Promise((resolve) => {
      let allOrders = []
      let data = []
      async.series([
        async (cb) => {
          let {data} = await OrderCtrl.getPendingOrderTables();
          allOrders = data;
          cb()
        }
      ], () => {
        async.each(TableJson, (item, cb) => {
          let obj = {
            name: item.name,
            tables: []
          }
          async.times(item.noOfTables, (eachTable, cb1) => {
            let count = eachTable + 1;
            let keyValue = `${item.name}-${count}`
            keyValue = keyValue.replace(/ /ig, '-').toLowerCase();
            let tabV = {
              name: `${item.shortName} ${count}`,
              key: keyValue
            }
            let findOrder = _.find(allOrders, (item) => {
              return item.tableNo == keyValue
            })
            if (findOrder) {
              tabV.totalAmount = findOrder.netAmount;
            }
            obj.tables.push(tabV);
            cb1()
          }, () => {
            data.push(obj);
            cb()
          })
        }, () => {
          resolve({...successObj, data: data})
        })
      })
    })
  }
}
export default exp;
