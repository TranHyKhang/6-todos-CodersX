const express = require('express');
const app = express();
const port = 3000;

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

app.get('/', function(req, res) {
    res.render('index', {
         todos: db.get('todos').value()
    });
});

app.get('/create', function(req, res) {
    res.render('create')
})

app.post('/create', function(req, res) {
    db.get('todos').push(req.body).write();
    res.redirect('/');
})





app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))