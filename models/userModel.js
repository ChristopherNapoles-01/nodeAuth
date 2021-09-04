const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

    email:{
        type:String,
        required:[true,'Please Enter an Email Address'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please Enter a Valid Email Address']
    },

    password:{
        type:String,
        required:[true,'Please Enter a Password'],
        minlength:[6, 'Minimum of 6 Characters'],
    },

},{timestamps:true}
);
//hash passwords
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth)
        {
            return user;
        }
        throw  Error('Incorrect Password');
    }
    throw Error ('Incorrect Email');
}
const User = mongoose.model('User',userSchema);
module.exports = User;