"use client";

import { Radio } from "@mui/material";

const PaymentMethod = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <>
      <div className="d-flex items-center">
        <Radio
          checked={paymentMethod === "prepay"}
          onChange={() => onPaymentMethodChange("prepay")}
          value="prepay"
        />
        <div className="text-14 lh-14 ml-5">Prepay</div>
      </div>
      <div className="d-flex items-center">
        <Radio
          checked={paymentMethod === "postpay"}
          onChange={() => onPaymentMethodChange("postpay")}
          value="postpay"
        />
        <div className="text-14 lh-14 ml-5">Postpay</div>
      </div>
    </>
  );
};

export default PaymentMethod;

