const express = require('express');
// import JWT from "express-jwt";
// import { secret } from "../../../config/settings";
import multer from 'multer';
import CategoryController from '../controllers/category';

const app = express.Router();
const upload = multer({dest: 'public/attachments/'});
const productDocument = [{name: 'categoryFile', maxCount: 1}];
export default (app) => {
  app
    .route('/addCategory')
    .post(upload.fields(productDocument), async (req, res) => {
      const {body, files} = req;
      let obj = JSON.parse(body.obj);
      if (files && files.categoryFile && files.categoryFile.length) {
        obj.categoryFile = {
          path: `/attachments/${files['categoryFile'][0].filename}`,
          fileName: files['categoryFile'][0].originalname,
        };
      }

      const response = await CategoryController.create(obj);
      res.send(response);
    });
  // app.post('/addCategory', async (req, res) => {
  //   let {body} = req;
  //   const response = await CategoryController.create(body)
  //   res.json(response)
  // })

  app.get('/getCategoryData', async (req, res) => {
    let {query} = req;
    const response = await CategoryController.findAllCategory(query);
    res.json(response);
  });
};
