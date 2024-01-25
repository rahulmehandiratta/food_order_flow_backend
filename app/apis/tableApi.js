import TableCtrl from "../controllers/tableCtrl"

export default (app) => {
  app.get('/table-list', async (req, res) => {
    let resp = await TableCtrl.tableList();
    res.send(resp)
  })
}
