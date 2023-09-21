// Globals
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB

mongoose.connect('mongodb+srv://JesusLara69:student2023@cluster0.ynwmqwh.mongodb.net/SignUp')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error(`Error connecting to MongoDB ${err}`)
});

// Set view engine

app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', async (req, res) => {
    const users = await User.find();
    res.render('home', {users});
});

app.get('/register', async (req, res) => {
    res.render('register');
});

app.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit', {user});
});

app.get('/delete/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('delete', {user});
});

app.post('/register', async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        organization: req.body.organization,
        password: req.body.password
    });
    await newUser.save();
    res.redirect('/');
});

app.post('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(req.body.password == user.password){
        const newInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            organization: req.body.organization,
            password: req.body.password
        };
        await user.updateOne(newInfo);
        res.redirect('/');
    }else{
        res.render('error');
    }
});

app.post('/delete/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(req.body.password == user.password){
        await user.deleteOne()
        res.redirect('/');
    }else{
        res.render('error');
    }
});

// Initiate the server

app.listen(PORT, () => {
    console.log(`Server now running at port: ${PORT}`);
});