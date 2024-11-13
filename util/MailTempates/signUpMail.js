// import { fileURLToPath } from "url";
import { dirname, join } from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import ejs from "ejs";
import chalk from "chalk";
export const sendMail = async (details) =>
{
    //transporter 
   const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    service:"gmail",
    auth:{
        user:process.env.NODEMAILER_MAIL,
        pass:process.env.NODEMAILER_MAIL_PASSWORD
    }
   });

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);
   const templatePath = join(__dirname, '../../views/signUpTemplate.ejs'); 
   let data = await ejs.renderFile(templatePath,{details});

   console.log(chalk.green("detail of mails ",details));
   // mail options
   const mailOptions = {
    from :process.env.NODEMAILER_MAIL,
    to:[details.email],
    subject:"Bazar 91 Signup Details !!",
    html:data,
    text:details?.message||"Something Went Wrong !!"

   };
   
   return new Promise((resolve,reject)=>{
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error)
        {
            console.log(error,"error");
            return reject(error);
        }

        return resolve("SignUp Mail Send Successfully !!",info.response);
    })
   })

}