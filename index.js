const express = require('express');
const app = express();
const port = 3000;
var shortid = require('shortid');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ todos: []})
  .write()

//Render on main page
app.get('/', function(req, res) {
    res.render('index', {
         todos: db.get('todos').value()
    });
});


// Render on create page
app.get('/create', function(req, res) {
    res.render('create')
})

// Search item
app.get('/search', function(req, res) {
    var q = req.query.q;
    var matched = db.get('todos').value().filter(item => {
        return item.text.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('index', {
        todos: matched
    })
})

//Delete item
app.get('/:id/delete', function(req, res) {
    var id = req.params.id;
    var delTodo = db.get('todos').find({id: id}).value();
    console.log(delTodo);
    db.get('todos').remove({text: delTodo.text}).write();
    res.render('index', {
        todos: db.get('todos').value()
    })
})

// View item
app.get('/:id', function(req, res) {
    var id = req.params.id;
    var todo = db.get('todos').find({id: id}).value();
    console.log(todo)

    res.render('view', {
        todo: todo
    })
})
  
// Create item
app.post('/create', function(req, res) {
    req.body.id = shortid.generate();
    db.get('todos').push(req.body).write();
    res.redirect('/');
})





app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))