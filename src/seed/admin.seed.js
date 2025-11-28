import UserModel from "../models/user.model.js";

export const seedAdmin =async ()=>{
    let existingAdmin = await UserModel.findOne({role:'admin'})
    if(existingAdmin){
        console.log("Admin already Exists, skipping seed ...")
        return;
    }
    let adminDetails = {
        email:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASSWORD,
        username:process.env.ADMIN_USERNAME,
        role:"admin",
        contactNumber:process.env.ADMIN_CONTACT_NUMBER,
        isVerified:true
    };

    await UserModel.create(adminDetails);

    await new UserModel(adminDetails).save()

    console.log("Admin details added to DB");
    
}