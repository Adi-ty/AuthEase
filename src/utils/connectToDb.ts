import mongoose from "mongoose";
import config from "config";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB 📊");
  } catch (err) {
    process.exit(1);
  }
}

export default connectToDb;
