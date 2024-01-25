const express = require('express');
const app = express.Router();
import multer from 'multer';
import productController from '../controllers/product';

const upload = multer({dest: 'public/attachments/'});
const productDocument = [{name: 'productFile', maxCount: 1}];
export default (app) => {
  app
    .route('/createProduct')
    .post(upload.fields(productDocument), async (req, res) => {
      const {body, files} = req;
      let obj = JSON.parse(body.obj);
      if (files['productFile'] && files['productFile'].length) {
        obj.productFile = {
          path: `/attachments/${files['productFile'][0].filename}`,
          fileName: files['productFile'][0].originalname,
        };
      }

      const response = await productController.create(obj);

      res.send(response);
    });

  // app.route("/createProduct").post(async (req, res) => {
  //   const { body, user } = req;
  //   const response = await productController.create(body, user);
  //   res.send(response);
  // });
  app.get('/productList', async (req, res) => {
    const {query} = req;
    const response = await productController.ProductList({
      ...query,
    });
    res.json(response);
  });

  app.get('/groupedProduct', async (req, res) => {
    const {query} = req;
    const response = await productController.groupedProduct(query);
    res.json(response);
  });
};
