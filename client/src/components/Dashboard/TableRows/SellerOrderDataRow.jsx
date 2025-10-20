import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
const SellerOrderDataRow = ({ order ,refetch, sellers}) => {
  let [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  console.log(order);
  const { customer, plantName, price, quantity, pending, _id, status } = order;
  console.log(order);
  const [orderUpdate, setOrderUpdate] = useState(pending);
  const axiosSecure = useAxiosSecure();
  const mutation = useMutation({
    mutationFn: async (update ) => {
      const { data , } = await axiosSecure.patch(`/seller/update/${_id}`, {
        status: update ,
      });
      return data;
    },
    onSuccess(data) {
      console.log(data);
    },
  });

  const handleUpdatePending = (e) => {
    const newStatus = e.target.value;
    setOrderUpdate(newStatus);
    mutation.mutate(newStatus);
    refetch()
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{customer.name}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{customer.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${price}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{plantName}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p
          className={`text-gray-900 whitespace-no-wrap ${
            status === "Pending"
              ? "text-blue-400"
              : status === "In Progress"
              ? "text-yellow-600"
              : status === "Delivered"
              ? "text-green-500"
              : ""
          }`}
        >
          {status ? status : "pending"}
        </p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-2">
          <select
            required
            className="p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white"
            name="category"
            value={orderUpdate}
            onChange={handleUpdatePending}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">Start Processing</option>
            <option value="Delivered">Deliver</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">Cancel</span>
          </button>
        </div>
        <DeleteModal isOpen={isOpen} closeModal={closeModal} deleteId={_id} sellers={sellers} refetch={refetch} />
      </td>
    </tr>
  );
};

export default SellerOrderDataRow;
