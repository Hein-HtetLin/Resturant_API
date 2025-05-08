import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", upload.single('image'), createCategory); // Accept image file
// , upload.single('image')
router.put("/:id",upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
