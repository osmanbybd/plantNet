
import axios from "axios";


export const imageUpload = async imageData =>{
        const imageFormData = new FormData();
    imageFormData.append('image', imageData)

       const {data} = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, imageFormData)
    //    console.log(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`);

    return data?.data?.display_url
}

// save or update user a info  in dv

export const saveUserInDb = async user =>{
    const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/user`, user)
    console.log(data);
}






 export const deleteOrderid = () =>{
    




}