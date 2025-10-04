import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "../Shared/Button/Button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateUserModal = ({ isOpen, closeModal, role, userEmail }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updateRole, setUpdateRole] = useState(role);
  console.log(updateRole);

  // get  data = useQuery
  // update/add/delete = useMutation

  const mutation = useMutation({
    mutationFn: async (role) => {
      const { data } = await axiosSecure.patch(
        `/user/role/update/${userEmail}`,
        { role }
      );
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      Swal.fire({
        title: "Update Done ",
        icon: "success",
        draggable: true,
      });
      closeModal();
      //   invalidate query
      queryClient.invalidateQueries(["users"]);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(updateRole);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeModal}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 shadow-xl p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-black"
              >
                Update User Role
              </DialogTitle>
              <form onSubmit={handleSubmit}>
                <div>
                  <select
                    value={updateRole}
                    onChange={(e) => setUpdateRole(e.target.value)}
                    className="my-4 border-gray-200 border w-full px-2 py-3 rounded-xl shadow-xl"
                    name="role"
                    id=""
                  >
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-400 px-3 py-2 rounded-lg cursor-pointer text-true-gray-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-red-400 px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateUserModal;
