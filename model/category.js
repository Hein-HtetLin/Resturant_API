import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true, unique: true }, // required
      my: { type: String, trim: true }, // optional
      th: { type: String, trim: true }, // optional
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Save မလုပ်ခင် empty string တွေကို `null` ပြောင်းပေးတဲ့ Middleware
categorySchema.pre('save', function(next) {
  if (this.name.my === '') {
    this.name.my = null;
  }
  if (this.name.th === '') {
    this.name.th = null;
  }
  next();
});


export default mongoose.model("Category", categorySchema);