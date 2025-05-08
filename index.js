import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API Running"));
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);


// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//   })
//   .catch((err) => console.error(err));


  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // သင့်ရဲ့ Menu model ကို ဒီမှာယူသုံးပါ။
    const Cate = mongoose.model('Category');
    const Menu = mongoose.model('Menu');

    // Index တွေကို သေချာအောင်လုပ်ပါ။
    return Cate.ensureIndexes().then(()=> Menu.ensureIndexes())
  })
  .then(() => {
    console.log('Menu indexes ensured successfully!');

    // Mongoose ချိတ်ဆက်မှုအောင်မြင်ပြီး Index တွေသေချာမှ Server ကို စတင်ပါ။
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error during startup:', err);
  });
