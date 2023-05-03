const multer = require("multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
  };

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'image');
    },
    filename: (req, file, callback) => {
      const extension = MIME_TYPES[file.mimetype];
      const name = file.originalname.split(' ').join('_').split("." + extension);
      if (extension == undefined) {
        callback(new Error('Invalid MIME TYPES'));
    } else {
        callback(null, name[0] + "_" + Date.now() + "." + extension);
    }
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1000000 // 1Mo
    },
  }).single('image');
  
  
  module.exports = (req, res, next) => {
    upload(req, res, (err) =>{
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        // la taille de l'image est trop grande
        return res.status(400).json({ error: `Taille de l'image trop grande` });
      } else if (!req.file) {
        // il n'y a pas de fichier
        return res.status(400).json({ error: `Aucune image sélectionnée` });
      } else if (err){
        return res.status(400).json({ error: `Une erreur s'est produite` });
      }
      next();
    });
  };