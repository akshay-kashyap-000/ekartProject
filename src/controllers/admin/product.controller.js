import expressAsyncHandler from 'express-async-handler';
import ProductModel from '../../models/product.model.js';
import ApiResponse from './../../utils/ApiResponse.utils.js';



export const uploadImage = expressAsyncHandler(async (req, res, next) => { })

export const updateImage = expressAsyncHandler(async (req, res, next) => { })

export const deleteImage = expressAsyncHandler(async (req, res, next) => { })

export const addProduct = expressAsyncHandler(async (req, res, next) => {
    const { name, stock, price, description, category, salePrice, brand } = req.body;

    const newProduct = await ProductModel.create({
        name, 
        stock, 
        price, 
        description, 
        category,
        salePrice, 
        brand,
    })

    new ApiResponse(200, "Product added successfully", newProduct).send(res)
})

export const getProducts = expressAsyncHandler(async (req, res, next) => { })

export const getProduct = expressAsyncHandler(async (req, res, next) => { })
export const updateProduct = expressAsyncHandler(async (req, res, next) => { })
export const deleteProduct = expressAsyncHandler(async (req, res, next) => { })

