import chalk from "chalk";
import mongoose from "mongoose";



export const mongoDbConnnection = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_DATABASE_URL);
        console.log(
          chalk.bold.italic.bgHex("#6495ED")(
            "Mongo Database Connection Successful"
          )
        );
    
    
    }catch(err)
    {
        console.log("Something Went Wrong in Database",err.message);
    }
}

