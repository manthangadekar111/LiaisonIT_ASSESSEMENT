const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./model/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/uniqueDB', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.once('open', function () {
    console.log("db connected...");
})


app.use(express.urlencoded());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', function (req, res) {
    res.render('insert', {
        title: 'insert'
    })
})

//enter name , email, password
app.post('/insert', async function (req, res) {
    const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    //    console.log("*****" , newuser);
    return res.redirect('/show');
})

//show all input data in show.ejs
app.get('/show', async function(req, res) {
    try {
      const results = await User.find({});
      res.render('show', { users: results });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error occurred');
    }
  });
//click delete option it will be deleted...
app.get('/delete/:id' , async function(req , res){
    await User.findByIdAndDelete(req.params.id);
    return res.redirect('/show');
})  

//click edit button and edit it....
app.get('/edit/:id', async function(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.render('edit', { users: user });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error occurred');
    }
  });
  

app.post('/update/:id' , async  function(req,res){
    await  User.findByIdAndUpdate(req.params.id  , req.body);
    res.redirect('/show');
   })
  

app.listen(port, (req, res) => {
    console.log("server is runnig  on port" + port);

})