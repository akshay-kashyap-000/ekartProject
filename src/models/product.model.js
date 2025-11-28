import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    title: {},
    description: {
        type: String,
        required: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    salePrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            asset_id: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        // enum:["Clothing", "Toys", "food"]
        required: true,
    },
    brand: {
        type: String,
        // enum:["NIKE", "ADIDAS", "POLO"]
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
        default: 5,
    },
    averageReviews: {
        type: Number,
        default: 0
    },
    // comments: {},
    //$ slug:{}, SEO(search engine optimization)
},
    { timestamps: true }
)

//!  collection/model
let ProductModel = mongoose.model("product", productSchema)

export default ProductModel;