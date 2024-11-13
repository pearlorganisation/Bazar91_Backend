import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import chalk from "chalk";
const authSchema = new mongoose.Schema({
    firstName: {
        type:String,
        minlength: [4, "Min Length Must Be 4"],
        maxlength: [100, "Max Length Should Be Less than 100"],
        required: true,
    },
    lastName: {
        type:String,
        minlength: [4, "Min Length Must Be 4"],
        maxlength: [100, "Max Length Should Be Less than 100"],
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F", "O"],
        required: true,
        select: false,
    },
    profileImage:{
        type:String
    },
    role:{
        type:String,
        enum:["EMP","ADMIN"],
        default:"EMP"
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please provide a valid email address.",
        },
        lowerCase:true,
        unique:true
    },
    password: {
        type: String,
        required: [true,"Please Input Password !!"],
        select: false,
    },
    confirmPassword:{
        type: String,
        required: [true,"Please Input Confirm Password !!"],
        validate:{
            
        validator:function(el){
         return el === this.password
        },

        message: "Both Password are not same",

    },
        select: false,
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
});


authSchema.methods.isPasswordCorrect = async function (password) {
    const isValid =  await bcrypt.compare(password, this.password); 
    return isValid;
};
authSchema.methods.generateAccessToken =  function(userData){
        return   jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
    }
authSchema.methods.generateRefreshToken =  function(userData){

        return   jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});

    }

authSchema.pre('save',async function (next){
    if(!this.isModified('password'))return next();
     
   this.password = await bcrypt.hash(this.password,12);
   
   this.confirmPassword = undefined;
   next();



});









export const AuthModel = mongoose.model("Auth", authSchema);


