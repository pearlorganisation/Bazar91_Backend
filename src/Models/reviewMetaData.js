import mongoose from "mongoose";

const reviewMetaDataSchema = new mongoose.Schema({

    reviewId:{
     type:mongoose.Types.ObjectId , 
     ref:"review"
    },
    likes:{
        type:number,
        default:0
    },
    dislike:{
        type:number,
        default:0
    }
},{
    timestamps:true
});

export const ReviewMetaDataModal = new mongoose.model("ReviewMetaData",reviewMetaDataSchema)