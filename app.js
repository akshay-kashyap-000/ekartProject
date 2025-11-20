import dotenv from 'dotenv'
dotenv.config({quiet:true}); //$ give path in option if .env file is not present in the root folder

import express from 'express'
import { errorMiddleware } from './src/middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/user/user.routes.js'
import addressRoutes from './src/routes/shop/address.routes.js'

const app = express();

app.use(express.json()) //? to handle json data
app.use(express.urlencoded({extended:true})); //? to handle form data
app.use(cookieParser())
app.use("/api/user", userRoutes)
app.use("/api/address", addressRoutes)

app.use(errorMiddleware)

export default app; 
