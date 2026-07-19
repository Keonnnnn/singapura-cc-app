const multer = require('multer');
const { GCSStorageEngine } = require('../utils/gcsStorageEngine');

const storage = new GCSStorageEngine({ folder: 'uploads' });

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024}
}).single('file');

const uploadEvent = multer({ storage: storage });



module.exports = {upload, uploadEvent};

