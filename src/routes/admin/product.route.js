import { Router } from "express";
import { addProduct } from "../../controllers/admin/product.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/add-product",authenticate,authorize ,addProduct)


export default router