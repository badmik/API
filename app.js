const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('2dodb', ['tasks']);

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Home
app.get('/', (req, res, next) => {
  res.send('Please use /api/tasks');
});

// Fetch All tasks
app.get('/api/tasks', (req, res, next) => {
  db.tasks.find((err, docs) => {
    if(err){
      res.send(err);
    }
    console.log('tasks Found...');
    res.json(docs);
  });
});

// Fetch Single task
app.get('/api/tasks/:id', (req, res, next) => {
  db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('task Found...');
    res.json(doc);
  });
});

// Add task
app.post('/api/tasks', (req, res, next) => {
  db.tasks.insert(req.body, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Adding task..');
    res.json(doc);
  });
});

// Update task
app.put('/api/tasks/:id', (req, res, next) => {
  db.tasks.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)},
    update:{
      $set:{
        name: req.body.name,
        category: req.body.category,
        details: req.body.details
      }},
      new: true }, (err, doc) => {
        if(err){
          res.send(err);
        }
        console.log('Updating tasks...');
        res.json(doc);
      })
});

// Delete task
app.delete('/api/tasks/:id', (req, res, next) => {
  db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Removing task...');
    res.json(doc);
  });
});


app.listen(port, () => {
  console.log('Server started on port '+port);
});
