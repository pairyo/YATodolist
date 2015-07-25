var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var Datastore = require('nedb');
var db = new Datastore({ filename: './todos.db', autoload: true});

var app = express();

app.set('port', process.env.PORT || 1314);
app.server = http.createServer(app);
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/todos/create', function(req, res) {
  var todo = req.body;
  db.insert(todo, function (err, newTodo) {
    if (err === null) {
      res.json(newTodo);
    } else {
      res.json({
        state: 'no',
        message: 'error occurred when creating todo'
      });
    }
  });
});

app.post('/todos/:id/update', function(req, res) {
  var todo = req.body;
  var _id = req.param('id');
  db.update({ _id: _id}, todo, {}, function (err, numReplaced) {
    if (err === null) {
      if (numReplaced === 1) {
        res.json({
          state: 'yes'
        });
      } else {
        res.json({
          state: 'no',
          message: 'No todo is updated'
        });
      }
    } else {
      res.json({
        state: 'no',
        message: 'error occurred when updating todo'
      });
    }
  });
});

app.get('/todos/:id/remove', function(req, res) {
  var _id = req.param('id');
  db.remove({ _id: _id}, {}, function (err, numRemoved) {
    if (err === null) {
      if (numRemoved === 1) {
        res.json({
          state: 'yes'
        });
      } else {
        res.json({
          state: 'no',
          message: 'No todo is removed'
        });
      }
    } else {
      res.json({
        state: 'no',
        message: 'error occurred when removing todo'
      });
    }
  });
});

app.get('/todos/index', function(req, res) {
  db.find({}, function (err, todos) {
    res.json(todos);
  });
});

app.get('/', function(req, res) {
  res.render('index.production.html');
});

app.get('/development', function(req, res) {
  res.render('index.development.html');
});

app.server.listen (app.get ('port'), function () {
});
