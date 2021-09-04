const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {checkUser} = require('./middlewares/authMiddleware');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('tiny'));

app.use(cookieParser());
const dbURI = 'mongodb://localhost/nodeAuth';
mongoose.connect(dbURI,{useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true})
.then(console.log('connected to db'))
.catch((err) => {
    console.log(err)
})

app.use(authRoutes);
app.use((req,res) => {
    res.status(404).render('404');
})
app.listen(3000);

