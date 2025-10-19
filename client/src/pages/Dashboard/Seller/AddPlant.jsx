// import axios from 'axios';
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imageUpload } from "../../../api/utils";

import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";

const AddPlant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();



  const mutation = useMutation({
    mutationFn: async (plantData) =>{
      const {data} = await axiosSecure.post(`/plants`, plantData);
      return data
     
    },
    onSuccess(data) {
      console.log(data)
      if (data?.insertedId) {
        Swal.fire({
          title: "Drag me!",
          icon: "success",
          draggable: true,
        });
        
      }
    }
    
  })
 


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const name = form?.name?.value;
      const price = form?.price?.value;
      const description = form?.description?.value;
      const quantity = form?.quantity?.value;
      const category = form?.category?.value;
      const image = form?.image.files[0];
      // return console.log(image)

      const imageUrl = await imageUpload(image);

      const plantData = {
        name,
        price: parseFloat(price),
        description,
        quantity: parseInt(quantity),
        category,
        image: imageUrl,
        seller: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL || "",
        },
      };
      console.table(plantData);

        mutation.mutate(plantData)
  
      // const { data } = await axiosSecure.post(`/plants`, plantData);
      // console.log(data);

      // if (data?.insertedId) {
      //   Swal.fire({
      //     title: "Drag me!",
      //     icon: "success",
      //     draggable: true,
      //   });
      //   form.reset();
      // }
      form.reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit={handleFormSubmit} loading={loading} />
    </div>
  );
};

export default AddPlant;
