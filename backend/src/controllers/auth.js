import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/db.js";

async function register(req, res){
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userData = await prisma.user.create({
            data: {name, email, passwordHash: hashedPassword}
        });
        if(!userData){
            return res.status(400).json({message: "Failed to register user"});
        }
        console.log("User created:", userData.email);
    } catch (error) {
        return res.status(500).json({message: "Internal server error during registration", error: error.message});
    }

    res.json({message: "User registered", "userDetails": {name, email}});
}

async function login(req, res) {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({where: {email}});
        
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        
        if(!match){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET);
        
        res.json({message: "success", "userDetails": {name: user.name, email: user.email}, token});
    } catch (error) {
        console.error("Login error:", {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
        });
        return res.status(500).json({message: "Internal server error during login"});
    }
}

export { register, login };
