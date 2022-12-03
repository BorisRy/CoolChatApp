

// FETCH
const uploadImg = async (file) => {
    // Defining our variables
    const CLOUD_NAME = 'dowk59699' // Insert yours
    const UPLOAD_PRESET = 'unri6zxb' // Insert yours
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const FORM_DATA = new FormData();
    // Building the request body
    FORM_DATA.append('file', file)
    FORM_DATA.append('upload_preset', UPLOAD_PRESET)
    // Sending a post method request to Cloudniarys' API
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: FORM_DATA
        })
        const { url } = await res.json()
        return url
    } catch (err) {
        console.error('ERROR!', err)
    }
}


export const cloudService = {
    uploadImg
}

