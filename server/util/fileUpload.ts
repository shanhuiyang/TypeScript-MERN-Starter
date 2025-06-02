import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { ApiError } from '../middleware/errorHandler';
import crypto from 'crypto';

// Define allowed file types and their corresponding MIME types
const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  csv: ['text/csv'],
};

// Define maximum file sizes in bytes
const MAX_FILE_SIZES = {
  images: 5 * 1024 * 1024, // 5MB
  documents: 10 * 1024 * 1024, // 10MB
  csv: 2 * 1024 * 1024, // 2MB
};

// Ensure upload directories exist
const createUploadDirectories = () => {
  const baseDir = path.join(__dirname, '../../uploads');
  const directories = ['images', 'documents', 'temp'];
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  directories.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Create upload directories on module load
createUploadDirectories();

// Generate a secure filename to prevent path traversal attacks
const generateSecureFilename = (originalname: string) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalname).toLowerCase();
  const sanitizedName = path.basename(originalname, extension)
    .replace(/[^a-zA-Z0-9]/g, '-')
    .substring(0, 20);
    
  return `${sanitizedName}-${timestamp}-${randomString}${extension}`;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const fileType = getFileType(file.mimetype);
    const uploadPath = path.join(__dirname, `../../uploads/${fileType || 'temp'}`);
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  }
});

// Helper to determine file type based on MIME type
const getFileType = (mimetype: string): string | null => {
  for (const [type, mimeTypes] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (mimeTypes.includes(mimetype)) {
      return type;
    }
  }
  return null;
};

// File filter to validate uploads
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileType = getFileType(file.mimetype);
  
  if (!fileType) {
    return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
  }
  
  // Check file size (multer will handle this, but we're adding an extra check)
  const maxSize = MAX_FILE_SIZES[fileType as keyof typeof MAX_FILE_SIZES];
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return cb(new ApiError(400, `File too large. Maximum size for ${fileType} is ${maxSize / (1024 * 1024)}MB`));
  }
  
  cb(null, true);
};

// Create multer upload instances
const createUploader = (fileType: keyof typeof MAX_FILE_SIZES) => {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZES[fileType],
    }
  });
};

// Export configured uploaders for different file types
export const imageUpload = createUploader('images');
export const documentUpload = createUploader('documents');
export const csvUpload = createUploader('csv');

// Utility function to remove a file
export const removeFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing file:', error);
    return false;
  }
};

// Utility function to get public URL for a file
export const getFileUrl = (req: Request, filePath: string): string => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const relativePath = filePath.split('uploads')[1].replace(/\\/g, '/');
  return `${baseUrl}/uploads${relativePath}`;
};