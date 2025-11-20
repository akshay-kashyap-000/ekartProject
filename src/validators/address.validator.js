import Joi from "joi";

export const addAddressSchema = Joi.object({
    addressLine:Joi.string().min(5).max(50).required(),
        city:Joi.string().min(5).max(50).required(),
        state:Joi.string().min(5).max(50).required(),
        pinCode:Joi.string().min(5).max(50).required(),
        phone:Joi.string()
                .length(10)
                .required()
                .pattern(/^[6-9]\d{9}$/)
                .message("Invalid Mobile Number"),
        notes:Joi.string().min(5).max(50).required(),
}) 