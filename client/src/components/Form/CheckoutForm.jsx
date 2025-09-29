import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./checkOutFrom.css";
import React, { useEffect, useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const CheckoutForm = ({ totalPrice, closeModal, orderData , fetchData}) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      // server request...
      const { data } = await axiosSecure.post("/create-payment-intent", {
        quantity: orderData?.quantity,
        plantId: orderData?.plantId,
      });

      setClientSecret(data?.clientSecret);
    };
    getClientSecret();
  }, [axiosSecure, orderData]);

  const handleSubmit = async (event) => {
    setProcessing(true);

    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setCardError(null);
    }

    // taka katbo ekhon

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        },
      },
    });
    if (result?.error) {
      setCardError(result?.error?.message);
    }
    if (result?.paymentIntent?.status === "succeeded") {
      // save order data in db
      orderData.transactionId = result?.paymentIntent?.id;
      try {
        const { data } = await axiosSecure.post("/order", orderData);
        if (data?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });

          const { data: result } = await axiosSecure.patch(
            `/quantity-update/${orderData.plantId}`,
            { quantityToUpdate: orderData?.quantity, status: "decrease" }
          );
          fetchData();
          console.log(result);
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      } finally {
        setProcessing(false);
        setCardError(null);
        closeModal();
      }

      // update product quantity in db from plant collection
    }
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {cardError && <p className="text-red-500 mb-5">{cardError}</p>}

      <div className="flex justify-between ">
        <button
          className="px-4 py-2 rounded cursor-pointer bg-green-400 font-semibold"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? <CircleLoader size={25} /> : `Pay ${totalPrice}$`}
        </button>

        <button className="btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
