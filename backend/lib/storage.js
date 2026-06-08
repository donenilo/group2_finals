const fs = require('fs/promises');
const path = require('path');

const STORAGE_PROVIDER = (process.env.STORAGE_PROVIDER || 'local').trim();

// Local filesystem implementation (writes under backend/uploads/...)
const saveLocal = async (itemId, fileName, buffer) => {
  const imageFolder = path.join(__dirname, '..', 'uploads', 'items', String(itemId));
  await fs.mkdir(imageFolder, { recursive: true });
  const savedPath = path.join(imageFolder, fileName);
  await fs.writeFile(savedPath, buffer);
  // imageKey format kept the same as before
  return path.posix.join('items', String(itemId), fileName);
};

// S3 implementation
let s3Client;
let S3_BUCKET;
let AWS_REGION;
try {
  if (STORAGE_PROVIDER === 's3') {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    AWS_REGION = process.env.AWS_REGION || 'us-east-1';
    S3_BUCKET = process.env.S3_BUCKET;
    if (!S3_BUCKET) throw new Error('S3_BUCKET not configured');
    s3Client = new S3Client({ region: AWS_REGION });
    // store PutObjectCommand for later use via dynamic import
    module.exports._PutObjectCommand = PutObjectCommand;
  }
} catch (err) {
  // will throw when trying to use s3; handled at runtime
}

const saveS3 = async (itemId, fileName, buffer, contentType) => {
  if (!s3Client) throw new Error('S3 client not configured');
  const key = `items/${itemId}/${fileName}`;
  const { PutObjectCommand } = module.exports._PutObjectCommand ? module.exports : require('@aws-sdk/client-s3');
  const cmd = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
    ACL: 'public-read'
  });
  await s3Client.send(cmd);
  return key;
};

const getPublicUrl = (imageKey) => {
  if (!imageKey) return '';
  if (STORAGE_PROVIDER === 's3') {
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${imageKey}`;
  }
  // local: served at /uploads/<imageKey>
  return `/uploads/${imageKey}`;
};

const saveItemImage = async (itemId, fileName, buffer, contentType) => {
  if (STORAGE_PROVIDER === 's3') {
    return await saveS3(itemId, fileName, buffer, contentType);
  }
  return await saveLocal(itemId, fileName, buffer);
};

module.exports = {
  saveItemImage,
  getPublicUrl,
  STORAGE_PROVIDER,
};
