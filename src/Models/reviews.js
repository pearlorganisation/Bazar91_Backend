import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
   productId :{
    ref:"Product",
    type:mongoose.Types.ObjectId
   },
   reviewBy:{
    ref:"Auth",
    type:mongoose.Types.ObjectId,
   },
   reviewHeadline:{
    type:String,
    minlength:[3,"Min Length For Headline is 3"],
    maxlength:[50,"Max Length For Headline is 50"]
   },
   reviewDescription:{
    type:String,
    minlength:[10,"Min Length For Headline is 3"],
    maxlength:[500,"Max Length For Headline is 50"]
   },
   reviewStarCount:{
    type:Number,
    min:[0,"Min Value for Review Star Count Field is 0"],
    max:[5,"Max Value for Review Star Count Field is 5"]
   }



},{
    timestamps:true
});

reviewSchema.index({productId:1,reviewBy:1},{unique:true});

export const ReviewModel = new mongoose.model("Review",reviewSchema);