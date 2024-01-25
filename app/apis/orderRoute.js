const express = require("express");

const app = express.Router();
import orderController from "../controllers/order";

export default (app) => {
  app.post("/addOrder", async (req, res) => {
    let {body, app} = req;
    let io = app.get('io');
    const response = await orderController.addOrder(body, io);
    res.json(response);
  });


  app.get("/getOrderByTableNo", async (req, res) => {
    let { query } = req;
    console.log(query,"this is query");
    const response = await orderController.oldKot(query);
    res.json(response);
  });


  app.post("/saveOrder", async (req, res) => {
    let { body } = req;
    console.log(body,"this is body");
    const response = await orderController.saveOrder(body);
    res.json(response);
  });

  app.get('/orderList', async (req, res) => {
    const {query} = req;
    const response = await orderController.findAllOrders({
      ...query,
    });
    res.json(response);
  });
};
