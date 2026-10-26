/**
 * Client-Side Image Compression & Validation Utility
 * Compresses camera/mobile photos down to efficient web sizes before upload.
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function validateAndCompressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = {}) {
  // 1. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid format. Only JPG, PNG, and WebP images are supported.')
  }

  // 2. Validate maximum file size (5 MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(`Image size (${sizeMB} MB) exceeds the 5 MB maximum limit.`)
  }

  // 3. Compress using HTML5 Canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to efficient WebP or JPEG
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/webp'
        const compressedDataUrl = canvas.toDataURL(outputFormat, quality)

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          width,
          height,
          type: outputFormat,
        })
      }

      img.onerror = () => reject(new Error('Failed to load image for compression.'))
      img.src = event.target.result
    }

    reader.onerror = () => reject(new Error('Failed to read file from disk.'))
    reader.readAsDataURL(file)
  })
}
