const express = require("express");

const app = express.Router();
import customerController from "../controllers/customer";

export default (app) => {

  app.route("/createCustomer").post(async (req, res) => {
    const {body, user} = req;
    const response = await customerController.create(body, user);
    res.send(response);
  });


  app.get("/customerList", async (req, res) => {
    const {query} = req;
    const response = await customerController.CustomerList({
      ...query,
    });
    res.json(response);
  });

  

  app.post("/updateCustomer", async (req, res) => {
    let {body, user} = req;
    let resp = await customerController.updateCustomer(body);
    res.json({
      ...resp,
    });
  });
  app.get("/getSingleCustomer/:_id", async (req, res) => {
    let { params } = req;
    let response = await customerController.getSingleCustomer(params);
    return res.json({ ...response });
  });
  app.delete("/deleteCustomer/:_id", async (req, res) => {
    let { params } = req;
    let resp = await customerController.deleteCustomer(params);
    return res.json({ ...resp });
  });
}
