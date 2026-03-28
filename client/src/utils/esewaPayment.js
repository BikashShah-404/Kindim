import { toast } from "react-toastify";

export const redirectToEsewa = async (initiatedPayment) => {
  try {
    if (initiatedPayment.status === 200) {
      const { paymentInitiate, order, nprRate } = initiatedPayment.data;

      console.log(paymentInitiate, order, nprRate);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = import.meta.env.VITE_ESEWA_GATEWAY_URL;

      const fields = {
        amount: Number(order.itemsPrice * nprRate).toFixed(2),
        tax_amount: Number(order.taxPrice * nprRate).toFixed(2),
        product_service_charge: 0,
        product_delivery_charge: Number(order.shippingPrice * nprRate).toFixed(
          2,
        ),
        product_code: import.meta.env.VITE_ESEWA_PRODUCT_CODE,
        total_amount: Number(order.totalPrice * nprRate).toFixed(2),
        transaction_uuid: paymentInitiate.transactionId,
        success_url: `${import.meta.env.VITE_CLIENT_URL}/payment/complete`,
        failure_url: `${import.meta.env.VITE_CLIENT_URL}/payment/failed`,
        signed_field_names: paymentInitiate.signed_field_names,
        signature: paymentInitiate.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  } catch (err) {
    console.log(err);
    toast.error(err.data.message || "Something went wrong...");
  }
};
