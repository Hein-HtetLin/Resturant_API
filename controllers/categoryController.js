import cloudinary from "../utils/cloudinary.js";
import Category from "../model/category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    // console.log(categories);
    if(categories){
        res.json(categories);
    }else{
        res.json("There is no categories pls add some category");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const nameStr = req.body.name;
    if (!nameStr) {
      return res.status(400).json({ message: 'Missing name data' });
    }

    const name = JSON.parse(nameStr);
    if (!name.en) {
      return res.status(400).json({ message: "English name is required" });
    }

    const checkUniqueName = async (lang, value) => {
      if (value) {
        const existing = await Category.findOne({ [`name.${lang}`]: value });
        if (existing) {
          throw new Error(`${lang === 'my' ? 'Myanmar' : 'Thai'} name already exists`);
        }
      }
    };

    await Promise.all([
      checkUniqueName('my', name.my),
      checkUniqueName('th', name.th),
    ]);

    const newCategory = new Category({
      name: {
        en: name.en,
        my: name.my || null,
        th: name.th || null,
      },
      image: req.file?.path || '',
      imagePublicId: req.file?.filename || '',
    });

    const savedCategory = await newCategory.save();
    console.log(savedCategory);
    res.status(201).json(savedCategory);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// export const updateCategory = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const name = JSON.parse(req.body.name); // same as createCategory
//       const updateData = {
//         name: {
//           en: name.en,
//           my: name.my || null,
//           th: name.th || null,
//         }
//       }
  
//       // If image is uploaded, update image and imagePublicId
//       if (req.file) {
//         updateData.image = req.file.path;
//         updateData.imagePublicId = req.file.filename;
//       }
  
//       const updated = await Category.findByIdAndUpdate(id, updateData, {
//         new: true,
//       });
  
//       res.json(updated);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   };
  

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const nameStr = req.body.name;

    if (!nameStr) {
      return res.status(400).json({ message: 'Missing name data' });
    }

    const name = JSON.parse(nameStr);
    if (!name.en) {
      return res.status(400).json({ message: "English name is required" });
    }

    const checkUniqueNameOnUpdate = async (lang, value, categoryId) => {
      if (value) {
        const existing = await Category.findOne({
          [`name.${lang}`]: value,
          _id: { $ne: categoryId }, // Update လုပ်နေတဲ့ Category မဟုတ်တာကိုပဲ ရှာဖွေမယ်
        });
        if (existing) {
          throw new Error(`${lang === 'my' ? 'Myanmar' : 'Thai'} name already exists`);
        }
      }
    };

    await Promise.all([
      checkUniqueNameOnUpdate('my', name.my, id),
      checkUniqueNameOnUpdate('th', name.th, id),
    ]);

    const updateData = {
      name: {
        en: name.en,
        my: name.my || null,
        th: name.th || null,
      },
    };

    // If image is uploaded, update image and imagePublicId
    if (req.file) {
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = Category.findById(id);


     // Cloudinary မှာ image ဖျက်
     if (category.imagePublicId) {
        await cloudinary.uploader.destroy(category.imagePublicId);
      }

    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
