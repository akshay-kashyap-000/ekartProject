import expressAsyncHandler from "express-async-handler";
import AddressModel from "../../models/address.model.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";

export const addAddress = expressAsyncHandler(async (req, res) => {
    const { addressLine, city, state, pinCode, phone, notes } = req.body;
    await AddressModel.create({
        addressLine,
        city,
        state,
        pinCode,
        phone,
        notes,
        userId: req.myUser._id,
    });

    new ApiResponse(200, "Address added successfully").send(res)
});

export const getAddresses = expressAsyncHandler(async (req, res, next) => {
    let addresses = await AddressModel.find({})

    new ApiResponse(201, "Address fetched successfully", addresses).send(res)
});

export const getAddress = expressAsyncHandler(async (req, res, next) => {
    let userId = req.myUser._id;

    let address = await AddressModel.find({ userId });

    new ApiResponse(200, "Address fetched successfully", address).send(res)
});

export const updateAddress = expressAsyncHandler(async (req, res, next) => {
    let userId = req.myUser._id;

    let updatedAddress = await AddressModel.findOneAndUpdate({ userId })

    new ApiResponse(201, "Address updated successfully", updatedAddress).send(res)
});

export const deleteAddress = expressAsyncHandler(async (req, res, next) => {
    let userId = req.myUser._id;

    let deletedAddress = await AddressModel.findOneAndDelete({userId})

    new ApiResponse(200, "Address deleted successfully", deletedAddress).send(res)
});