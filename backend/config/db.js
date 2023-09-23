import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default async function ConnectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
}
