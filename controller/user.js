import { userModels,generateToken,userValidator } from "../models/user.js";
import bcrypt from "bcryptjs";

export const addUser = async (req, res) => {
    let { email, password, userName,role } = req.body;

    const result =  userValidator(req.body);
    console.log(result)
    if (result.error)
        return res.status(400).json({ type: "invalid data", message: result.error.details[0].message })
    try {
        const sameUser = await userModels.findOne({ email: email });
        if (sameUser)
            return res.status(409).json({ type: "same user", message: "user with such email already exists" })
        let hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new userModels({ email, password: hashedPassword, userName,role:role});
        let token = generateToken(newUser._id, newUser.role, newUser.userName);
        await newUser.save();
        return res.json({ _id: newUser.id, userName: newUser.userName, token, email: newUser.email })

    }  catch(err){
        console.log(err);
        res.status(400).json({ type: "invalid operation", message: "cannot add user" })
    }  
}

export const login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password)
        return res.status(404).json({ type: "missing parameters", message: "please send email user name and password" })
    try {
        const user = await userModels.findOne({ email: email });
        if (!user)
            return res.status(404).json({ type: "no  user", message: "one or more details are invalid" })
        if (!await bcrypt.compare(password, user.password))
            return res.status(404).json({ type: "no  user", message: "user password is invalid" })
        let token = generateToken(user._id, user.role, user.userName);
        return res.json({ _id: user.id, userName: user.userName, token, email: user.email })
    }
    catch (err) {
        res.status(400).json({ type: "invalid operation", message: "cannot sign in user" })
    }
}

export const getAllUsers= async(req,res)=>{
    try {
        let allUsers = await userModels.find({}, "-password");
        res.json(allUsers);
    } catch (err) {
        res.status(400).json({ type: "invalid operation", message: "cannot sign in user" })
    }

}
