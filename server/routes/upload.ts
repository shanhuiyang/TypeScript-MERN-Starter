import express from 'express';
import { Request, Response } from 'express';
import { imageUpload, documentUpload, csvUpload, getFileUrl } from '../util/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';
import { isAuthenticated } from '../config/passport-consumer';

const router = express.Router();

/**
 * @route POST /api/upload/image
 * @desc Upload an image file
 * @access Private
 */
router.post('/image', isAuthenticated, imageUpload.single('image'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }
  
  const fileUrl = getFileUrl(req, req.file.path);
  
  res.status(200).json({
    success: true,
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    }
  });
}));

/**
 * @route POST /api/upload/document
 * @desc Upload a document file
 * @access Private
 */
router.post('/document', isAuthenticated, documentUpload.single('document'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No document file provided' });
  }
  
  const fileUrl = getFileUrl(req, req.file.path);
  
  res.status(200).json({
    success: true,
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    }
  });
}));

/**
 * @route POST /api/upload/csv
 * @desc Upload a CSV file
 * @access Private
 */
router.post('/csv', isAuthenticated, csvUpload.single('csv'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No CSV file provided' });
  }
  
  const fileUrl = getFileUrl(req, req.file.path);
  
  res.status(200).json({
    success: true,
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    }
  });
}));

export default router;