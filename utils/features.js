// import DataURIParser from "datauri/parser.js";
// import path from "path";

// export const getDataUri = (file) => {
//   const parser = new DataURIParser();
//   const extName = path.extname(file.originalname).toString();
//   return parser.format(extName, file.buffer);
// };


// Importing DataURIParser and path modules
import DataURIParser from "datauri/parser.js";
import path from "path";

// Function to convert file to Data URI
export const getDataUri = (file) => {
  const parser = new DataURIParser(); // Initialize the parser

  // Get the file extension
  const extName = path.extname(file.originalname);

  // Format the file buffer into a Data URI and return it
  return parser.format(extName, file.buffer).content;
};
