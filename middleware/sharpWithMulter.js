const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const multerUpload = multer({ storage }).single("image");

const sharpFunction = async (req, res, next) => {
    multerUpload(req, res, async (err) => {
        if (err) {
            return next(err);
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier à télécharger' });
        }
        const { buffer, originalname } = req.file;
        const extension = originalname.lastIndexOf('.');
        const newName = originalname.substring(0, extension);
        const addName = Date.now();
        const newFilename = `${addName}_${newName}.webp`;
        const outputPath = `./images/${newFilename}`;
        try {
            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile(outputPath);

            req.file.buffer = newFilename;
            next();
        } catch (error) {
            next(error);
        }
    });
};

module.exports = sharpFunction;
