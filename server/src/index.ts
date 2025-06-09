import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import contactRouter from "./routes/contactRouter";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", contactRouter);


(async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
