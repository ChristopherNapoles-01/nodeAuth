const express = require('express');
const app = express();
const User = require('../models/userModel');
const jwt  = require('jsonwebtoken');

app.use(express.urlencoded({extended:true}));
//handle errors from creating an account
const handleErrors = (err) => {
    console.log(err.message,err.code);
    let errors = {email:'',password:''}
    //for login
    if (err.message === 'Incorrect Email')
    {
        errors.email = 'That Email is Not Registered';
        return errors;
    }
    if (err.message === 'Incorrect Password'){
        errors.password = 'Wrong Password';
        return errors;
    }
    //for signup
    if (err.code === 11000){
        errors.email = 'Email already registered';
        return errors;
    }

    if(err.message.includes('User validation failed'))
    { 
        console.log(err);
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }
}

//create token
const limit = 3*24*60*60;
const createToken = (id) => {

    const secret = jwt.sign({id}, 'jwtSecret', {
        expiresIn:limit,
    })
    return secret;
}

const homepage = (req,res) => {
    res.render('index');
}

const login = (req,res) => {
    res.render('login');
}
const login_post = async (req,res) => {
    const {email,password} = req.body;
    
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
       //use token
        res.cookie('jwtSecret',token,{httpOnly:true,maxAge:limit*1000});
        res.status(200).json({user:user._id});
        console.log(req.body);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
const signup = (req,res) => {
    res.render('signup');
}
const signup_post = async (req,res) => {
    const {email,password} = req.body;

    try{
       const user = await User.create({email,password})
       const token = createToken(user._id);
       //use token
       res.cookie('jwtSecret',token,{httpOnly:true,maxAge:limit*1000});
       res.status(201).json({user:user._id});
       console.log(req.body);
    }
    catch (err) {
       const errors = handleErrors(err);
       res.status(400).json({errors});
    }
}

const profile = async (req,res) => {

}

const logout = (req,res) => {
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
}
module.exports = {
    homepage,
    login,
    login_post,
    signup,
    signup_post,
    profile,
    logout,
}