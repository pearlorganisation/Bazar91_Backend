import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();
// Configure Cloudinary using environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
});


// Function to handle single or multiple file uploads
export const uploadFileToCloudinary = async (files) => {

  try {
    // Ensure files is always an array for uniform processing
    const fileArray = Array.isArray(files) ? files : [files];
    
    // Map each file to the upload function
    const uploadPromises = fileArray.map((file) =>{

      let resourceType = "raw"; // Default to "raw" for non-image, non-video files

      // Determine the resource type based on file extension
      if (file?.path.match(/\.(jpg|jpeg|png|gif|webp|jfif)$/i)) {
        resourceType = "image";
      } else if (file?.path.match(/\.(mp4|mov|avi|mkv)$/i)) {
        resourceType = "video";
      } else if (file?.path.match(/\.(pdf|odf|docx)$/i)) {
        console.log(chalk.magentaBright("Shashank"))
        resourceType = "raw";
      }
      
      console.log(chalk.magenta("hi there"))
      return cloudinary.uploader.upload(file.path,{
        folder: "Bazar91", // Specify the folder where the file will be stored
        resource_type: resourceType
      })}
    );

    // Wait for all promises (uploads) to complete
    const uploadResults = await Promise.all(uploadPromises);
    // Map and return only the necessary details from the upload results
    return uploadResults.map((result) => ({
      // [{}]-> for one file, [{},{}]=> for multiple file
      secure_url: result.secure_url,
      public_id: result.public_id,
    }));
  } catch (error) {
    throw new Error(`File upload failed: ${error}`);
  }
};

export const deleteFileFromCloudinary = async (files) => {
  const publicIds = Array.isArray(files)
    ? files.map((file) => file.public_id) // Map public_id from the array
    : [files.public_id]; // If single object, wrap public_id in an array

  try {
    // Delete multiple files from Cloudinary using async/await
    const deleteResults = await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(
            `File with public_id ${publicId} deleted from Cloudinary`
          );
          return { publicId, result }; // Return result for each file
        } catch (error) {
          console.error(
            `Error deleting file with public_id: ${publicId}:`,
            error
          );
          return { publicId, error: error.message || "Deletion failed" }; // Return error for each file
        }
      })
    );
    console.log("Deleted Result: ", deleteResults);
    // Check if there were any errors
    const failedDeletes = deleteResults.filter((res) => res.error); // response when deletion failed = {"result": "", "error": {}}
    if (failedDeletes.length > 0) {
      console.log("Failded deletes Response: ", failedDeletes);
      return {
        success: false,
        message: "Some files failed to delete",
        failedDeletes,
      };
    }

    return { success: true, result: deleteResults };
  } catch (error) {
    console.error("Error during Cloudinary deletion process:", error);
    return {
      success: false,
      message: "Error during Cloudinary deletion",
      error: error.message,
    };
  }
};
