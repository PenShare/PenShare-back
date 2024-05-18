import Note from "../models/Note.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createNote = async (req, res) => {
    try {
        // Cloudinary ile dosya yükleme işlemi
        const result = await cloudinary.uploader.upload(
            req.files.yukle.tempFilePath, // Dosyanın geçici yolu
            {
                resource_type: "auto", // Yüklenen dosyanın türünü otomatik belirle
                use_filename: true, // Orijinal dosya adını kullan
                folder: "PenShare"   // Cloudinary'de bu klasöre yükle
            }
        );

        // Not oluşturma işlemi
        const not = await Note.create({
            name: req.body.name,
            description: req.body.description,
            course: req.body.course,  // HTML formundan gelen 'course' bilgisini al
            user: res.locals.user._id,
            url: result.secure_url,  // Cloudinary'den dönen güvenli URL
            not_bilgi: result.public_id
        });
        // Geçici dosyayı silme işlemi
        fs.unlinkSync(req.files.yukle.tempFilePath);

        // Yönlendirme işlemi (Notlar sayfasına)
        res.status(201).redirect("/nots"); // Başarılı yükleme sonrası notların listelendiği sayfaya yönlendir
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message
        });
    }
};


const getAllNotes = async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.redirect('/login');
        }
        const nots = await Note.find({ user: { $ne: res.locals.user._id } });
        return res.status(200).render("nots", {
            nots,
            link: "nots",
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            succeeded: false,
            message: error.message,
        });
    }
};

const getAnot = async (req, res) => {
    try {
        const tek_not = await Note.findById({ _id: req.params.id }).populate("user");
        let yetkili = false;
        if (res.locals.user) {
            yetkili = Note.user.equals(res.locals.user._id)
        }


        res.status(200).render("tek_not", {
            tek_not,
            link: "nots",// bunu nots.html de yakalamak gerekir 
            yetkili,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message,
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const not = await Note.findById({ _id: req.params.id })
        const notId = not.not_bilgi;
        await cloudinary.uploader.destroy(notId);
        await Note.findOneAndDelete({ _id: req.params.id });
        res.status(200).redirect("/nots");
    } catch (error) {
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message,
        });
    }
};

const getNotlarim = async (req, res) => {
    try {
        const nots = await Note.find({ user: res.locals.user._id });
        res.status(200).render("notlarim", {
            nots,
            link: "notlarim",
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            succeded: false,
            message: error.message,
        });
    }
}
//not ekle sayfası fonksiyonu
const getNotEkle = async (req, res) => {
    res.status(200).render("notekle", {
        link: "notekle",
    });
}

exports.getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        res.json({ data: note }).status(StatusCodes.OK);
    } catch (error) {
        res
            .json({ message: "Not getirilemedi" })
            .status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

exports.getNotesByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        const notes = await Note.find({ author });
        res.json({ data: notes }).status(StatusCodes.OK);
    } catch (error) {
        res
            .json({ message: "Notlar getirilemedi" })
            .status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


export { createNote, getAllNotes, getAnot, deleteNote, getNotlarim, getNotEkle, };