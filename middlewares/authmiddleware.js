import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            //  try {
            if (err) {
                console.log(err.message);
                // res.redirect("/login");
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.userId);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}
const authenticationToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if (err) {
                    res.sendStatus(401).json({
                        status: "fail",
                        succeded: false,
                        message: err.message,
                        error: "Not authorized"
                    });
                    res.redirect("/login");
                } else {
                    next();
                }
            });
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        res.sendStatus(401).json({
            status: "fail",
            succeded: false,
            message: error.message,
            error: "Not authorized"
        });

    }
}
export { authenticationToken, checkUser }