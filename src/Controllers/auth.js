import chalk, { Chalk } from "chalk";
import errorResponse from "../../util/errorResponse.js";
import { sendMail } from "../../util/MailTempates/signUpMail.js";
import { AuthModel } from "../Models/auth.js"
import jwt from "jsonwebtoken";
import { UserMetaDataModel } from "../Models/userMetaData.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../util/asyncHandler.js";

export const signUp = asyncHandler(async(req,res,next)=>{
  
   const {email,firstName,lastName,password,confirmPassword,gender} = req.body;

  const checkIfAlreadyExists = await AuthModel.findOne({email});
   if(checkIfAlreadyExists)
   {
      return next(new errorResponse("Email Already Registered !!",400));
   }

   const payload =  {       
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    gender
   };
  
   const token = jwt.sign(
    {...payload},
    process.env.JWT_SECRET_KEY,
    {
        expiresIn:process.env.EXPIRES_IN
    }
   )
  

   await sendMail({email,token,BACKEND_URL:process.env.BACKEND_URL,message:"Hi Welcome To Bazar 91"});

   res.status(201).json({status:true,message:"User Signed Up Successfully !!"})

});

export const verifyToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Verify the JWT token
  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new errorResponse("Failed to verify the token", 401)); // Return error if token is invalid or expired
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the user in AuthModel (replace with your logic)
    const user = await AuthModel.create([{ ...decodedData }], { session });

    // Create the associated metadata in UserMetaDataModel (replace with your logic)
    await UserMetaDataModel.create([{ authId: user[0]?._id }], { session }); // Access the first user in the array

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    // Respond with success message
    res.status(200).json({
      status: true,
      message: "Email Verified Successfully !!",
    });
  } catch (err) {
    // Rollback transaction if there's an error
    await session.abortTransaction();
    
    // Pass the error to the error handler with a proper message
    return next(new errorResponse("Something went wrong. Please try signing up again!", 500));
  } finally {
    // End the session after transaction is done
    session.endSession();
  }
});

export const signIn = asyncHandler(async (req,res,next)=>{
  
  const {email,password} = req.body;

  const isEmailExists = await AuthModel.findOne({email}).select('+password');
  if(!isEmailExists)
  {
     return next(new errorResponse("Email Does Not Exists !!",400));
  }
  

  if(!(isEmailExists.isPasswordCorrect(password)))
  {
    return next(new errorResponse("Password Or Email Does Not Match !!",401));
  }

  const accessToken =  isEmailExists.generateAccessToken({email});
  const refreshToken =  isEmailExists.generateRefreshToken({email});
  
  isEmailExists.refreshToken = refreshToken;
  await isEmailExists.save({runValidators:false});
  
  res.cookie('ACCESS_TOKEN_BAZAR91',accessToken,{
  httpOnly :true,
  secure:process.env.NODE_ENV === "production",
  maxAge:process.env.ACCESS_TOKEN_MAX_AGE||"15m"
  }
);

  res.cookie('REFRESH_TOKEN_BAZAR91',refreshToken,{
  httpOnly :true,
  secure:process.env.NODE_ENV === "production",
  maxAge:process.env.REFRESH_TOKEN_MAX_AGE||"15d"
  }
);


res.status(200).json({
  success: true,
  message: "Login successful",
  accessToken,
  refreshToken
});







});

export const refreshToken = asyncHandler(async (req,res,next)=>{

  const {REFRESH_TOKEN_BAZAR91:refreshToken} = req.cookies;

  if (!refreshToken) {
    return next(new errorResponse("No refresh token provided", 401));
  }
  const isValid = jwt.verify(refreshToken,process.env.JWT_SECRET_KEY);

  if(!isValid)
  {
    res.clearCookie("ACCESS_TOKEN_BAZAR91", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict", 
    });
  
    // Clear the refresh token cookie
    res.clearCookie("REFRESH_TOKEN_BAZAR91", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
    });
    return next(new errorResponse("Your refresh token is expired. Login again!", 401));  }

  const currUser = await AuthModel.findOne({email:isValid.email});

  if(currUser.refreshToken !== refreshToken)
  {
    return next(new errorResponse("Your Refresh Token Is Expired Login Again !!",401));
  }

  const newAccessToken = currUser.generateAccessToken({email:currUser.email});
  const accessTokenMaxAge = parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) || 45 * 60 * 1000; // default 45 mins


  res.cookie('ACCESS_TOKEN_BAZAR91',newAccessToken,{
    httpOnly :true,
    secure:process.env.NODE_ENV === "production",
    maxAge: accessTokenMaxAge || 15 * 60 * 1000,
    }
  );
  
  
  
  res.status(200).json({
    success: true,
    message: "Token Assigned SuccessFull  !!",
    newAccessToken,
  });
  


});