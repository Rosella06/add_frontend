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
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

const resizeImage = (file: File): Promise<File> => {
  return new Promise(async (resolve, reject) => {
    try {
      let blob: Blob = file

      if (
        file.type === 'image/heic' ||
        file.name.toLowerCase().endsWith('.heic')
      ) {
        const convertedBlob = (await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: JPEG_QUALITY
        })) as Blob
        blob = convertedBlob
      }

      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const [newWidth, newHeight] = calculateSize(img)
          const canvas = document.createElement('canvas')
          canvas.width = newWidth
          canvas.height = newHeight

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context is null'))
            return
          }

          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          canvas.toBlob(
            resultBlob => {
              if (!resultBlob) {
                reject(new Error('Failed to create Blob'))
                return
              }

              console.log(
                `Original Image - ${readableBytes(
                  file.size
                )} :::::: Compressed Image - ${readableBytes(resultBlob.size)}`
              )

              const newFile = new File(
                [resultBlob],
                file.name.replace(/\.\w+$/, '.jpg'),
                { type: 'image/jpeg' }
              )

              resolve(newFile)
            },
            'image/jpeg',
            JPEG_QUALITY
          )
        }

        img.onerror = () => reject(new Error('Image load error'))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    } catch (error) {
      reject(error)
    }
  })
}

const isSafeImageUrl = (url: string) =>
  url?.startsWith('blob:') || url?.startsWith('https://')

export { resizeImage, isSafeImageUrl }