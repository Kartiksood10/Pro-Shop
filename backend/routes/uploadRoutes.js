import path from "path";
import express from "express";
import multer from "multer"; // third party middleware function used to handle file uploads
const router = express.Router();

// stores the uploaded images in an uploads folder locally
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// only jpg/jpeg/png files allowed to be uploaded

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

// When a client sends a POST request to this route with an image file attached to the 'image' field,
// Multer will handle the file upload, validate the file type, and save the image to the 'uploads/' directory.
//  The response from the server will be the path to the uploaded image, which can then be used to display the image on the website.

export default router;
