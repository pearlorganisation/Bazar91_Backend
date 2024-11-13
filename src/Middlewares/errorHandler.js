import chalk from "chalk";
import errorResponse from "../../util/errorResponse.js";


const validationErrorHandler = (err) =>{

  const errors = Object.keys(err.errors).map((key) => `${key}: ${err.errors[key]}`) ;
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new errorResponse(msg, 400);
}
const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}:${err.value}!!`;

  
  return new errorResponse(msg,400);
}
const duplicateKeyErrorHandler = (err)=>{

    const keys = Object.keys(err.keyValue);

    const msg = `There is already a data with name "${keys[0]}". Please use another ${keys[0]} for this  field!`
    return new errorResponse(msg, 400);


}

const tokenExpiredErrorHandler = ()=>{
  const msg = `Token expired. Please log in again.`

  return new errorResponse(msg,400);
}

const invalidTokenErrorHandler = ()=>{
  const msg = `Invalid token. Please Try again.`

  return new errorResponse(msg,400);
}

export const errorHandler = (err,req,res,next)=>{


    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Internal Server Error";

   if(process.env.NODE_ENV === "development")
   {
     return res.status(err.statusCode).json(
      {status:err.status,message:"Server Side Error !!",err,stack:err.stack});
   }
   else if(process.env.NODE_ENV === "production")
   {
    if(err.name === "CaseError")
        err = castErrorHandler
    if(err.code === 11000)
      err = duplicateKeyErrorHandler(err);
    if(err.name === "ValidationError")
      err = validationErrorHandler(err);
    // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err = invalidTokenErrorHandler();
  }

  // Handle JWT token expiration
  if (err.name === "TokenExpiredError") {
    err = tokenExpiredErrorHandler();

  }

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: err.message || "Something went wrong!!",
      });
    }

   }
   
    

}