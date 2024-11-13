import mongoose from "mongoose";


const userMetaDataSchema = new mongoose.Schema({
    authId:{
        type:mongoose.Types.ObjectId,
        ref:"Auth",
        unique:true
    },
    productPurchased:{
      type:[]
    },
    productWishListed:{
      type:[]
    },
    productReviewsLikes:[{}],
    productReviewsDisLikes:[{}]
},{timestamps:true});

export const UserMetaDataModel = mongoose.model("UserMetaData",userMetaDataSchema);