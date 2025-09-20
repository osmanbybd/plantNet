// import axios from 'axios';
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imageUpload } from "../../../api/utils";
import axios from "axios";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const AddPlant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/plants`,
        plantData
      );
      console.log(data);

      if (data?.insertedId) {
        Swal.fire({
          title: "Drag me!",
          icon: "success",
          draggable: true,
        });
        form.reset();
      }
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
