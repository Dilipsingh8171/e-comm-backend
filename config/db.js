import mongoose from "mongoose";

 const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log(`Database connected ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Mongodb error ${error}`);
  }
};
export default connectDB