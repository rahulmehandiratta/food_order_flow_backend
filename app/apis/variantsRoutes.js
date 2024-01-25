const express = require("express");
// import JWT from "express-jwt";
// import { secret } from "../../../config/settings";

const app = express.Router();
import VariantController from '../controllers/variants' 
export default(app)=>{

    app.post('/addVariant', async(req,res)=>{  
      let { body } = req;

        const response = await VariantController.create(body)
        res.json(response)
      })
      
      app.get("/getVariantData",async (req, res) => {
        const response = await VariantController.getVariant();
        res.json(response);
      });
      
  
}