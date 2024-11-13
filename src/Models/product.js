
import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    productTitle:{
        type:String,
        trim:true,
        minlength:[5,"Min Length For Product Title is 5"],
        maxlength:[300,"Min Length For Product Title is 300"],
        required:true
    },
    price:{
        type:Number,
        min:[1,"Min Length For Price  is 5"],
        max:[10000000000,"Max Length For Price is 10000000000"],
        required:true

    },
    productDescription:{
        type:String
    },
    productImages:{
        type:[{}],
    },
    productBanner:{
        type:{}
    },
    quantity:{
      type:Number,
      default:0,
      min:[0,"Max Value For Quantity is 0"],
      max:[1000000,"Max Value For Quantity is 1000000"] ,
      required:true
 
    },
    wishListed:{
        type:Number,
        default:0
    },
    videoMetaData:{
        type:{}
    },
    optionalTags:[{}],
    discount:{
        type:Number,
        min:0,
        max:98
}
    
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
});

productSchema.virtual('discountedPrice').get(function(){
    const discountedPrice = this.price*(this.discount/100); 
    return this.price - discountedPrice;
})

export const ProductModel = new mongoose.model("Product",productSchema);    

