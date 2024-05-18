import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";
import { createToken } from "./usercontroller.js"



const register = async (req, res) => {

    try {
        let { name, surname, password, email } = req.body;
        const user = await User.create(req.body);
       // res.redirect("/login");

    } catch (error) {
        console.error("Kullanıcı oluşturma işlemi sırasında hata oluştu:", error);

        const errors2 = {};

        if (error.code === 11000) {
            errors2.email = "Bu e-mail veri tabanında kayıtlı! Lütfen başka bir e-mail deneyiniz.";
        }

        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach(key => {
                errors2[key] = error.errors[key].message;
            });
        }
        console.error("Oluşan hatalar:", errors2);
        res.status(400).json(errors2);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ email: "E-mail bulunamadı!" });
        }
        let same = false;
        if (user) {
            same = await bcrypt.compare(password, user.password);
        } else {
            res.status(401).json({ password: "Şifre hatalı!" });
        }
        if (same) {
            const token = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
            res.redirect("dashboard");
        } else {
            res.status(401).json({
                succeded: false,
                error: "şifre hatalı!",
            });
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user._id } });
        res.status(200).render("users", {
            users,
            link: "users", 
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message,
        });
    }
};

const getAUser = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        const nots = await Note.find({ user: req.params.id });
        res.status(200).render("user", {
            user,
            nots,
            link: "user",
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message,
        });
    }
}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const getDashbordPage = async (req, res) => {
    const nots = await Note.find({ user: res.locals.user._id });

    res.render('dashboard', {
        link: "dashboard",
        nots
    });
}
const getNotlarimPage = async (req, res) => {
    const nots = await Note.find({ user: res.locals.user._id });
    res.render('notlarim', {
        link: "notlarim",
        nots,
    });
}
const getNotEklePage = async (req, res) => {
    const nots = await Note.find({ user: res.locals.user._id })
    res.render('notekle', {
        link: "notekle",
    });
}

export { register, login, createToken, getDashbordPage, getAllUsers, getAUser, getNotlarimPage, getNotEklePage };
