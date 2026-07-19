const { Storage } = require('@google-cloud/storage');
const { nanoid } = require('nanoid');
const path = require('path');

// Same auth pattern as routes/user.js: locally, SERVICE_ACCOUNT_FILE points at a
// downloaded key file; on Cloud Run it's unset and falls back to Application
// Default Credentials via the attached service account.
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  ...(process.env.SERVICE_ACCOUNT_FILE && { keyFilename: process.env.SERVICE_ACCOUNT_FILE }),
});
const bucket = storage.bucket(process.env.BUCKET_NAME);

// Multer custom storage engine that streams uploads straight to GCS instead of
// local disk — Cloud Run's filesystem is ephemeral, so anything written to
// disk (e.g. public/uploads) disappears on restart and isn't shared across
// instances. Returning { filename } from _handleFile keeps req.file.filename
// working exactly like the old diskStorage-based code expected.
class GCSStorageEngine {
  constructor(options = {}) {
    this.folder = options.folder || 'uploads';
  }

  _handleFile(req, file, cb) {
    const filename = `${nanoid(10)}${path.extname(file.originalname)}`;
    const blob = bucket.file(`${this.folder}/${filename}`);
    const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });

    file.stream
      .pipe(blobStream)
      .on('error', cb)
      .on('finish', () => cb(null, { filename }));
  }

  _removeFile(req, file, cb) {
    bucket.file(`${this.folder}/${file.filename}`).delete().then(() => cb(null)).catch(cb);
  }
}

module.exports = { GCSStorageEngine };
