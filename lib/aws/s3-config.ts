import { S3Client } from '@aws-sdk/client-s3';

// Configuración para AWS S3
const s3Config = {
  region: process.env.REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  },
};

// Cliente de S3
export const s3Client = new S3Client(s3Config);

// Configuración del bucket
export const bucketConfig = {
  bucketName: process.env.S3_BUCKET_NAME || 'electricautomatic-documentos',
  maxFileSize: 10 * 1024 * 1024, // 10MB por defecto
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export default { s3Client, bucketConfig }; 