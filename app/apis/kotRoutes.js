import kotController from "../controllers/kot";
import {JWTCheck} from "../controllers/_utils";

export default (app) => {
  app.post("/addKot", async (req, res) => {
    let {body} = req;
    const response = await kotController.addKot(body);
    res.json(response);
  });
  app.post("/getPendingKot", async (req, res) => {
    const response = await kotController.pendingKot();
    res.json(response);
  });
  app.post("/updateKotStatus", JWTCheck, async (req, res) => {
    let {body, app} = req;
    let io = app.get('io');
    const response = await kotController.updateStatus(body, io);
    res.json(response);
  });

  app.get('/kotList', async (req, res) => {
    const {query} = req;
    const response = await kotController.findAllKot({
      ...query,
    });
    res.json(response);
  });

};
