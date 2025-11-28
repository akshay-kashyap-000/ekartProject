import dotenv from 'dotenv'
dotenv.config({quiet:true}); //$ give path in option if .env file is not present in the root folder

import express from 'express'
import { errorMiddleware } from './src/middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/user/user.routes.js'
import addressRoutes from './src/routes/shop/address.routes.js'
import productRoutes from './src/routes/admin/product.route.js'
import { seedAdmin } from './src/seed/admin.seed.js';


const app = express();

console.log(process.argv);
if(process.argv[2] === "seed") seedAdmin()

app.use(express.json()) //? to handle json data
app.use(express.urlencoded({extended:true})); //? to handle form data
app.use(cookieParser())
app.use("/api/user", userRoutes)
app.use("/api/address", addressRoutes)
app.use("/api/admin/product",productRoutes)

app.use(errorMiddleware)

export default app; 
