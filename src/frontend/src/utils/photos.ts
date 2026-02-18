/**
 * Utility functions for handling photo uploads and display in blog posts.
 * Provides validation, file reading, and rendering helpers for post photos.
 */

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface PhotoData {
  dataUrl: string;
  contentType: string;
}

/**
 * Validates if a file is an acceptable image type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Image file size must be less than 5MB',
    };
  }

  return { valid: true };
}

/**
 * Reads a File and converts it to a data URL for backend storage
 */
export async function readFileAsDataUrl(file: File): Promise<PhotoData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        dataUrl: result,
        contentType: file.type,
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a safe preview URL from stored photo data
 * The backend stores photos as data URLs (base64 encoded)
 */
export function getPhotoPreviewUrl(photoData: string): string {
  // The backend stores the full data URL, so we can use it directly
  return photoData;
}

/**
 * Checks if a post has a valid photo
 */
export function hasValidPhoto(photoData: string | undefined | null): boolean {
  if (!photoData) return false;
  if (photoData === 'legacy') return false; // Migration placeholder
  if (photoData.trim() === '') return false;
  return true;
}

/**
 * Gets accepted file types for input element
 */
export function getAcceptedImageTypes(): string {
  return ACCEPTED_IMAGE_TYPES.join(',');
}
