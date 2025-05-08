import express from "express";
import {
  getAllMenus,
  createMenu,
  getMenusByCategory,
//   updateCategory,
//   deleteCategory,
} from "../controllers/menuController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllMenus);
router.get("/category/:categoryId", getMenusByCategory);
router.post("/", upload.single('image'), createMenu); 

// router.put("/:id",upload.single("image"), updateCategory);
// router.delete("/:id", deleteCategory);

export default router;