import axios from "axios";

const uploadPhoto = async (data) => {
    const _data = { value: data };
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:2001/upload-image", _data)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};
export default uploadPhoto