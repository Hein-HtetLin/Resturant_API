import mongoose from "mongoose";
const menuSchema = new mongoose.Schema(
    {
      name: {
        en: { type: String, required: true, trim: true },
        my: { type: String, trim: true },
        th: { type: String, trim: true },
      },
      description: {
        en: { type: String, required: true, trim: true },
        my: { type: String, trim: true },
        th: { type: String, trim: true },
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      imagePublicId: {
        type: String,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },

  
      // Time-based availability only
      availableFrom: {
        type: String, // e.g., "06:00"
      },
      availableTo: {
        type: String, // e.g., "22:00"
      },
    },
    { timestamps: true }
  );

  // Save မလုပ်ခင် empty string တွေကို `null` ပြောင်းပေးတဲ့ Middleware
menuSchema.pre('save', function(next) {
    if (this.name.my === '') {
      this.name.my = null;
    }
    if (this.name.th === '') {
      this.name.th = null;
    }
    next();
  });



export default mongoose.model("Menu", menuSchema);
