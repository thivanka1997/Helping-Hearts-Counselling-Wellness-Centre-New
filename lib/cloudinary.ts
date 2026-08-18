import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/**
 * Upload a file buffer to Cloudinary.
 * @param buffer   Raw file buffer from the uploaded file
 * @param folder   Cloudinary subfolder name e.g. "courses" | "blogs" | "events" | "gallery" | "lecturers"
 * @param publicId Optional custom public ID (auto-generated if omitted)
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder: `helping-hearts/${folder}`,
      resource_type: 'image',
      // Auto-optimize quality & format, and cap width at 1200px
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' },
      ],
    };

    if (publicId) uploadOptions.public_id = publicId;

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload returned no result'));
        } else {
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Call this before replacing an image so old files are cleaned up.
 * @param publicId Cloudinary public_id stored alongside the URL in MongoDB
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
