/**
 * Image Utility Functions
 */

/**
 * Get image URL from File object or image object with url property
 * @param {File|Object} image - Image file or image object with url property
 * @param {string} baseUrl - Optional base URL for constructing full URLs (defaults to NEXT_PUBLIC_LISTING_SERVICE_URL or http://localhost:8081)
 * @returns {string|null} - Image URL or null if invalid
 */
export const getImageUrl = (image, baseUrl = null) => {
  if (!image) return null;

  // If it's a file object, create object URL
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  // If it's an existing image with URL, use the full URL
  if (image.url) {
    // Check if URL is already complete (absolute URL)
    if (image.url.startsWith("http://") || image.url.startsWith("https://")) {
      return image.url;
    }

    const baseUrl = process.env.NEXT_PUBLIC_LISTING_SERVICE_URL;
    const cleanUrl = baseUrl?.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

    // Construct full URL from relative path
    const apiBaseUrl = cleanUrl || "http://localhost:8081";
    
    return `${apiBaseUrl}${image.url}`;
  }

  return null;
};

