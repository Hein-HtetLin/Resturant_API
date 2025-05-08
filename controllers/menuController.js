import cloudinary from "../utils/cloudinary.js";
import Menu from "../model/Menu.js";

export const getAllMenus = async (req, res) => {
    try {
      const menus = await Menu.find().populate('category', 'name').sort({ createdAt: -1 }); // 'category' ကို 'name' field နဲ့ Populate လုပ်ပါ။
      res.status(200).json(menus);
    } catch (err) {
      console.error('Error fetching all menus:', err);
      res.status(500).json({ message: 'Failed to fetch menu items' });
    }
  };


  export const getMenusByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
  
      const menus = await Menu.find({ category: categoryId }).populate('category', 'name');
  
      if (!menus || menus.length === 0) {
        return res.status(404).json({ message: 'No menu items found for this category' });
      }
  
      res.status(200).json(menus);
  
    } catch (err) {
      console.error('Error fetching menus by category:', err);
      res.status(500).json({ message: 'Failed to fetch menu items' });
    }
  };
  




export const createMenu = async (req, res) => {
  try {
    const { nameStr, descriptionStr, price, category, availableFrom, availableTo } = req.body;
    const image = req.file?.path; // Cloudinary က ပေးတဲ့ Image URL
    const imagePublicId = req.file?.filename; // Cloudinary က ပေးတဲ့ Public ID

    if (!nameStr || !descriptionStr || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const name = JSON.parse(nameStr);
    const description = JSON.parse(descriptionStr);
    const parsedPrice = parseFloat(price);

    if (!name.en || !description.en || isNaN(parsedPrice)) {
      return res.status(400).json({ message: 'English name, description, and price are required' });
    }

    const checkUniqueName = async (lang, value) => {
      if (value) {
        const existing = await Menu.findOne({ [`name.${lang}`]: value });
        if (existing) {
          throw new Error(`${lang === 'my' ? 'Myanmar' : 'Thai'} menu name already exists`);
        }
      }
    };

    await Promise.all([
      checkUniqueName('my', name.my),
      checkUniqueName('th', name.th),
    ]);

    const newMenu = new Menu({
      name: {
        en: name.en,
        my: name.my || null,
        th: name.th || null,
      },
      description: {
        en: description.en,
        my: description.my || null,
        th: description.th || null,
      },
      price: parsedPrice,
      category: category,
      availableFrom: availableFrom || null,
      availableTo: availableTo || null,
      image: image || '',
      imagePublicId: imagePublicId || '',
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);

  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(400).json({ message: err.message });
  }
};