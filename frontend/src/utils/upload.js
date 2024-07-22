import axios from "axios";

const upload = async (file) =>{
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "CHESS-BUDDY");

    try {
        const res = await axios.post(import.meta.env.VITE_CLOUDINARY_API, data);
        const {url} = res.data;
        return url;
    } catch (error) {
        console.log(error)
    }
};

export default upload;