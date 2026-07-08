export async function uploadImageToCloudinary(file: File): Promise<{ secure_url: string; public_id: string }> {
  try {
    // 1. Get the signature from our API
    const signResponse = await fetch('/api/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'sharod_darshan' })
    })

    if (!signResponse.ok) {
      throw new Error('Failed to get upload signature')
    }

    const { signature, timestamp, apiKey, cloudName, folder } = await signResponse.json()

    // 2. Upload to Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', folder)

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await uploadResponse.json()
    return {
      secure_url: data.secure_url,
      public_id: data.public_id
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}
