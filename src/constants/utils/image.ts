import heic2any from 'heic2any'

const isMobile = /Mobi|Android/i.test(navigator.userAgent)
const MAX_DIMENSION = 1080
const JPEG_QUALITY = isMobile ? 0.7 : 0.8

const calculateSize = (img: HTMLImageElement): [number, number] => {
  let { width, height } = img
  if (width > height) {
    if (width > MAX_DIMENSION) {
      height = Math.round((height * MAX_DIMENSION) / width)
      width = MAX_DIMENSION
    }
  } else {
    if (height > MAX_DIMENSION) {
      width = Math.round((width * MAX_DIMENSION) / height)
      height = MAX_DIMENSION
    }
  }
  return [width, height]
}

const readableBytes = (bytes: number): string => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

const resizeImage = async (file: File): Promise<File> => {
  try {
    let blob: Blob = file

    if (
      file.type === 'image/heic' ||
      file.name.toLowerCase().endsWith('.heic')
    ) {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: JPEG_QUALITY
      })
      blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    }

    const imageBitmap = await createImageBitmap(blob)

    const [newWidth, newHeight] = calculateSize({
      width: imageBitmap.width,
      height: imageBitmap.height
    } as HTMLImageElement)

    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight)

    const resultBlob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    })

    if (!resultBlob) {
      throw new Error('Failed to create blob from canvas')
    }

    console.log(
      `Original: ${readableBytes(file.size)} -> Compressed: ${readableBytes(
        resultBlob.size
      )}`
    )

    const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
    const newFile = new File([resultBlob], newFileName, {
      type: 'image/jpeg',
      lastModified: Date.now()
    })

    return newFile
  } catch (error) {
    console.error('Image resize failed:', error)
    throw error
  }
}

const isSafeImageUrl = (url?: string | null): boolean => {
  if (!url) return false
  return url.startsWith('blob:') || url.startsWith('https://')
}

export { resizeImage, isSafeImageUrl }
