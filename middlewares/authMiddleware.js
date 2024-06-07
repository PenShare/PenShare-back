const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

exports.authenticationToken = async (req, res, next) => {
 try {
    const token = req.cookies.jwt;

  if(token){
    jwt.verify(token,process.env.JWT_SECRET,(err)=>{
        if(err){
            res.status(401).json({message:"Token geçersiz"})
        }else{
            next();
         }
    });
}else{
    res.status(401).json({message:"Token yok"})
}
    } catch (error) {
        res.status(401).json({message:"Token yok"})
    }
}

exports.checkUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token){
            jwt.verify(token,process.env.JWT_SECRET,async (err,decoded)=>{
                if(err){
                    res.status(401).json({message:"Token geçersiz"})
                }else{
                    const user = await User.findById(decoded.userId
                    );
                    req.locals.user = user;
                    next();
                }
            }
            )
        }else{
            res.locals.user = null;
            next();
        }
    }
    catch (error) {
        res.status(401).json({message:"Token yok"})
    }
}



        

