import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

const OrderDelete = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const orderDeleted = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/order/deleted/${id}`);
      return data;
    },
    onSuccess: (data, variables, context) => {
      toast.success("✅ Order deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });

      // 1️⃣ Refetch updated data
      if (context?.refetch) context.refetch();

      // 2️⃣ React Query cache invalidate (for instant UI update)
      queryClient.invalidateQueries(["sellers"]);

      // 3️⃣ Close modal
      if (context?.closeModal) context.closeModal();
    },
    onError: () => {
      toast.error("❌ Failed to delete order!", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    },
  });

  // 🧩 Function to call from modal
  const handleOrderDelete = (id, closeModal, refetch) => {
    orderDeleted.mutate(id, { context: { closeModal, refetch } });
  };

  return { handleOrderDelete, isDeleting: orderDeleted.isPending };
};

export default OrderDelete;
