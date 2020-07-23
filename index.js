// 외부 모듈 import
const express = require('express');
const db = require('./data/db.js');
const app = express();



// middle ware 등록
app.use(express.json());  // request body를 사용하기 위함
app.use(express.static('public')); // static file을 사용하기 위함
app.listen(3000);

app.get('/', (req, res) => {
  res.render('index'); // index.html render
})

// routing
app.route('/api/task')
  .get(async (req, res) => {
    const result = {success: true};
    try {
      const json = await db.getData();
      result.data = json.task;
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .post(async (req, res) => {
    const result = {success: true}
    const folder = req.body.task
    try {
      const json = await db.getData()
      json.task = folder
      await db.setData(json)
    } catch (err) {
      result.success = false
      result.err = err
    }
    res.json(req.body);
  })

